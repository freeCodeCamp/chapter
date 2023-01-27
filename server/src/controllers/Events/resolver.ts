import { inspect } from 'util';
import {
  events,
  events_venue_type_enum,
  event_users,
  Prisma,
  rsvp,
  venues,
} from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  Authorized,
} from 'type-graphql';

import { isEqual, sub } from 'date-fns';

import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';
import {
  Event,
  EventUserWithRelations,
  EventWithRelationsWithEventUserRelations,
  EventWithRelationsWithEventUser,
  EventWithChapter,
  EventWithVenue,
  User,
  PaginatedEventsWithTotal,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import mailerService, { batchSender } from '../../services/MailerService';
import {
  createReminder,
  deleteEventReminders,
  updateRemindAt,
} from '../../services/Reminders';
import {
  addEventAttendee,
  cancelEventAttendance,
  deleteCalendarEvent,
  removeEventAttendee,
  updateCalendarEventDetails,
} from '../../services/Google';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { createCalendarEventHelper } from '../../util/calendar';
import { updateWaitlistForUserRemoval } from '../../util/waitlist';
import { redactSecrets } from '../../util/redact-secrets';
import {
  chapterAdminUnsubscribeOptions,
  chapterUnsubscribeOptions,
  eventUnsubscribeOptions,
} from '../../util/eventEmail';
import { formatDate } from '../../util/date';
import { isOnline, isPhysical } from '../../util/venue';
import { EventInputs } from './inputs';

const SPACER = `<br />
----------------------------<br />
<br />
`;
const TBD_VENUE_ID = 0;
const TBD = 'Undecided/TBD';

const eventUserIncludes = {
  user: true,
  rsvp: true,
  event_role: true,
};

type EventWithUsers = Prisma.eventsGetPayload<{
  include: {
    venue: true;
    sponsors: true;
    event_users: {
      include: { user: true; event_reminder: true };
      where: { subscribed: true };
    };
  };
}>;

const sendRsvpInvitation = async (
  user: Required<ResolverCtx>['user'],
  event: events & { venue: venues | null },
) => {
  const linkDetails: CalendarEvent = {
    title: event.name,
    start: event.start_at,
    end: event.ends_at,
    description: event.description,
  };
  if (event.venue?.name) linkDetails.location = event.venue?.name;

  const unsubscribeOptions = eventUnsubscribeOptions({
    chapterId: event.chapter_id,
    eventId: event.id,
    userId: user.id,
  });

  await mailerService.sendEmail({
    emailList: [user.email],
    subject: `Confirmation of attendance: ${event.name}`,
    htmlEmail: `Hi${user.name ? ' ' + user.name : ''},<br>
You should receive a calendar invite shortly. If you do not, you can add the event to your calendars by clicking on the links below:<br />
<br />
<a href=${google(linkDetails)}>Google</a>
<br />
<a href=${outlook(linkDetails)}>Outlook</a>
<br />
${unsubscribeOptions}
      `,
  });
};

const createEmailForSubscribers = async (
  buildEmail: Promise<{
    subject: string;
    body: string;
  }>,
  emaildata: EventWithUsers,
) => {
  const { body, subject } = await buildEmail;
  batchSender(function* () {
    for (const { user } of emaildata.event_users) {
      const email = user.email;
      const unsubscribeOptions = eventUnsubscribeOptions({
        chapterId: emaildata.chapter_id,
        eventId: emaildata.id,
        userId: emaildata.id,
      });
      const text = `${body}<br>${unsubscribeOptions}`;
      yield { email, subject, text };
    }
  });
};
const updateReminders = (event: EventWithUsers, startAt: Date) => {
  // This is asychronous, but we don't use the result, so we don't wait for it
  if (!isEqual(startAt, event.start_at)) {
    event.event_users.forEach(({ event_reminder }) => {
      if (event_reminder) {
        updateRemindAt({
          eventId: event_reminder.event_id,
          remindAt: sub(startAt, { days: 1 }),
          userId: event_reminder.user_id,
        });
      }
    });
  }
};

const hasVenueLocationChanged = (data: EventInputs, event: EventWithUsers) =>
  data.venue_type !== event.venue_type ||
  (isPhysical(event.venue_type) && data.venue_id !== event.venue_id);
const hasDateChanged = (data: EventInputs, event: EventWithUsers) =>
  !isEqual(data.ends_at, event.ends_at) ||
  !isEqual(data.start_at, event.start_at);
const hasStreamingUrlChanged = (data: EventInputs, event: EventWithUsers) =>
  data.venue_type !== event.venue_type ||
  (isOnline(event.venue_type) && data.streaming_url !== event.streaming_url);

const buildEmailForUpdatedEvent = async (
  data: EventInputs,
  event: EventWithUsers,
) => {
  const subject = `Details changed for event ${event.name}`;

  const createVenueLocationContent = async () => {
    if (!data.venue_id)
      return `Location of event is currently ${TBD}.${SPACER}`;

    const venue = await prisma.venues.findUniqueOrThrow({
      where: { id: data.venue_id },
    });

    // TODO: include a link back to the venue page
    return `The event is now being held at <br />
    <br />
- ${venue.name} <br />
- ${venue.street_address ? venue.street_address + '<br />- ' : ''}
${venue.city} <br />
- ${venue.region} <br />
- ${venue.postal_code} ${SPACER}`;
  };
  const createDateUpdates = () => {
    return `
  - Start: ${formatDate(data.start_at)}<br />
  - End: ${formatDate(data.ends_at)}${SPACER}`;
  };
  const createStreamUpdate = () => {
    return `Streaming URL: ${data.streaming_url || TBD}${SPACER}`;
  };

  const streamingUrl =
    hasStreamingUrlChanged(data, event) && isOnline(data.venue_type)
      ? createStreamUpdate()
      : '';
  const venueLocationChange =
    hasVenueLocationChanged(data, event) && isPhysical(data.venue_type)
      ? await createVenueLocationContent()
      : '';
  const dateChange = hasDateChanged(data, event) ? createDateUpdates() : '';

  const body = `Updated venue details<br/>
${venueLocationChange}
${streamingUrl}
${dateChange}
`;
  return { subject, body };
};

const getUpdateData = (data: EventInputs, event: EventWithUsers) => {
  const getVenueData = (
    data: EventInputs,
    venueType: events_venue_type_enum,
  ) => ({
    streaming_url: isOnline(venueType) ? data.streaming_url : null,
    venue:
      isPhysical(venueType) && data.venue_id !== TBD_VENUE_ID
        ? { connect: { id: data.venue_id } }
        : { disconnect: true },
  });

  const venueType = data.venue_type ?? event.venue_type;
  const update = {
    invite_only: data.invite_only ?? event.invite_only,
    name: data.name ?? event.name,
    description: data.description ?? event.description,
    url: data.url, // allows url deletion
    start_at: new Date(data.start_at) ?? event.start_at,
    ends_at: new Date(data.ends_at) ?? event.ends_at,
    capacity: data.capacity ?? event.capacity,
    image_url: data.image_url ?? event.image_url,
    venue_type: venueType,
    ...getVenueData(data, venueType),
  };
  return update;
};

const chapterUserInclude = {
  include: {
    chapter_role: true,
    user: true,
  },
};

type ChapterUser = Prisma.chapter_usersGetPayload<typeof chapterUserInclude>;

/* TODO: Tying the notification to a particular chapter role is an unnecessary
coupling. The roles should just grant permissions and nothing else and,
Post-MVP, we should consider reworking this.

A possible solution is to have a settings table that contains the types of
notifications a user wants to receive. The role would be relegated to granting a
permission that allows the admin to configure the notifications so they get
these emails. */
const rsvpNotifyAdministrators = async (
  rsvpingUser: User,
  chapterAdministrators: ChapterUser[],
  eventName: string,
) => {
  const subject = `New attendee for ${eventName}`;
  const body = `User ${rsvpingUser.name} is attending.`;

  await batchSender(function* () {
    for (const { chapter_id, user } of chapterAdministrators) {
      const email = user.email;
      const unsubscribeOptions = chapterAdminUnsubscribeOptions({
        chapterId: chapter_id,
        userId: user.id,
      });
      const text = `${body}<br />${unsubscribeOptions}<br />`;
      yield { email, subject, text };
    }
  });
};

type EventRsvpName = events & { event_users: (event_users & { rsvp: rsvp })[] };
const getNameForNewRsvp = (event: EventRsvpName) => {
  const going = event.event_users.filter(({ rsvp }) => rsvp.name === 'yes');
  const waitlist = going.length >= event.capacity;
  return event.invite_only || waitlist ? 'waitlist' : 'yes';
};

@Resolver()
export class EventResolver {
  @Query(() => PaginatedEventsWithTotal)
  async paginatedEventsWithTotal(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
  ): Promise<PaginatedEventsWithTotal> {
    const total = await prisma.events.count();
    const events = await prisma.events.findMany({
      include: {
        chapter: true,
      },
      orderBy: {
        start_at: 'asc',
      },
      take: limit ?? 10,
      skip: offset,
    });
    return { total, events };
  }

  @Query(() => [EventWithChapter])
  async paginatedEvents(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
  ): Promise<EventWithChapter[]> {
    return await prisma.events.findMany({
      where: {
        AND: [
          {
            canceled: false,
            ends_at: { gt: new Date() },
          },
        ],
      },
      include: {
        chapter: true,
      },
      orderBy: {
        start_at: 'asc',
      },
      take: limit ?? 10,
      skip: offset,
    });
  }

  @Authorized(Permission.EventEdit)
  @Query(() => EventWithRelationsWithEventUserRelations, { nullable: true })
  async dashboardEvent(
    @Arg('id', () => Int) id: number,
  ): Promise<EventWithRelationsWithEventUserRelations | null> {
    return await prisma.events.findUnique({
      where: { id },
      include: {
        chapter: true,
        venue: true,
        event_users: {
          include: eventUserIncludes,
          orderBy: { user: { name: 'asc' } },
        },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Authorized(Permission.EventsView)
  @Query(() => [EventWithVenue])
  async dashboardEvents(
    @Ctx() ctx: Required<ResolverCtx>,
    @Arg('showCanceled', () => Boolean, { nullable: true })
    showCanceled = true,
  ): Promise<EventWithVenue[]> {
    return await prisma.events.findMany({
      where: {
        ...(!isAdminFromInstanceRole(ctx.user) && {
          chapter: isChapterAdminWhere(ctx.user.id),
        }),
        ...(!showCanceled && { canceled: false }),
      },
      include: { venue: true },
      orderBy: { start_at: 'desc' },
    });
  }

  @Query(() => EventWithRelationsWithEventUser, { nullable: true })
  async event(
    @Arg('id', () => Int) id: number,
  ): Promise<EventWithRelationsWithEventUser | null> {
    return await prisma.events.findUnique({
      where: { id },
      include: {
        chapter: true,
        venue: true,
        event_users: {
          include: {
            user: true,
            rsvp: true,
          },
          orderBy: { user: { name: 'asc' } },
        },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Authorized(Permission.Rsvp)
  @Mutation(() => EventUserWithRelations)
  async rsvpEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUserWithRelations> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id: eventId },
      include: {
        event_users: { include: eventUserIncludes },
        venue: true,
        chapter: {
          select: {
            calendar_id: true,
          },
        },
      },
    });

    // TODO: find by permission, not role.
    const chapterAdministrators = await prisma.chapter_users.findMany({
      where: {
        chapter_id: chapterId,
        subscribed: true,
        chapter_role: { is: { name: 'administrator' } },
      },
      ...chapterUserInclude,
    });

    const oldEventUser = await prisma.event_users.findUnique({
      include: { rsvp: true },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });

    const newRsvpName = getNameForNewRsvp(event);

    let eventUser: EventUserWithRelations;
    if (oldEventUser) {
      if (['yes', 'waitlist'].includes(oldEventUser.rsvp.name)) {
        throw Error('Already Rsvped');
      }

      eventUser = await prisma.event_users.update({
        data: { rsvp: { connect: { name: newRsvpName } } },
        include: eventUserIncludes,
        where: {
          user_id_event_id: {
            user_id: ctx.user.id,
            event_id: eventId,
          },
        },
      });
    } else {
      const eventUserData: Prisma.event_usersCreateInput = {
        user: { connect: { id: ctx.user.id } },
        event: { connect: { id: eventId } },
        rsvp: { connect: { name: newRsvpName } },
        event_role: { connect: { name: 'member' } },
        subscribed: true,
      };
      eventUser = await prisma.event_users.create({
        data: eventUserData,
        include: eventUserIncludes,
      });

      // NOTE: this relies on there being an event_user record, so must follow
      // that.
      if (newRsvpName !== 'waitlist') {
        await createReminder({
          eventId,
          remindAt: sub(event.start_at, { days: 1 }),
          userId: ctx.user.id,
        });
      }
    }

    const calendarEventId = event.calendar_event_id;
    const calendarId = event.chapter.calendar_id;
    if (calendarId && calendarEventId) {
      try {
        await addEventAttendee(
          { calendarId, calendarEventId },
          { attendeeEmail: ctx.user.email },
        );
      } catch (e) {
        console.error('Unable to add attendee to calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }

    await sendRsvpInvitation(ctx.user, event);
    await rsvpNotifyAdministrators(ctx.user, chapterAdministrators, event.name);
    return eventUser;
  }

  @Authorized(Permission.Rsvp)
  @Mutation(() => EventUserWithRelations, { nullable: true })
  async cancelRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUserWithRelations | null> {
    const eventUser = await prisma.event_users.findUniqueOrThrow({
      include: { rsvp: true, event_reminder: true },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });
    if (eventUser.rsvp.name === 'no') {
      throw Error('Rsvp is already canceled');
    }

    const event = await prisma.events.findUniqueOrThrow({
      where: { id: eventId },
      include: {
        event_users: { include: eventUserIncludes },
        venue: true,
        chapter: { select: { calendar_id: true } },
      },
    });

    await updateWaitlistForUserRemoval({ event, userId: ctx.user.id });

    const updatedEventUser = await prisma.event_users.update({
      data: {
        rsvp: { connect: { name: 'no' } },
        subscribed: false,
        ...(eventUser.event_reminder && { event_reminder: { delete: true } }),
      },
      include: eventUserIncludes,
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });

    const calendarId = event.chapter.calendar_id;
    const calendarEventId = event.calendar_event_id;

    if (calendarId && calendarEventId) {
      try {
        await cancelEventAttendance(
          { calendarId, calendarEventId },
          { attendeeEmail: ctx.user.email },
        );
      } catch (e) {
        console.error('Unable to cancel attendance at calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }
    return updatedEventUser;
  }

  @Authorized(Permission.RsvpConfirm)
  @Mutation(() => EventUserWithRelations)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<EventUserWithRelations> {
    const updatedUser = await prisma.event_users.update({
      data: { rsvp: { connect: { name: 'yes' } } },
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: { event: { include: { chapter: true } }, ...eventUserIncludes },
    });

    const unsubscribeOptions = eventUnsubscribeOptions({
      chapterId: updatedUser.event.chapter_id,
      eventId: updatedUser.event_id,
      userId,
    });

    await mailerService.sendEmail({
      emailList: [updatedUser.user.email],
      subject: 'Your attendance is confirmed',
      htmlEmail: `Your reservation is confirmed. You can attend the event ${updatedUser.event.name}
${unsubscribeOptions}`,
    });

    const calendarId = updatedUser.event.chapter.calendar_id;
    const calendarEventId = updatedUser.event.calendar_event_id;

    if (calendarId && calendarEventId) {
      try {
        await addEventAttendee(
          { calendarId, calendarEventId },
          { attendeeEmail: updatedUser.user.email },
        );
      } catch (e) {
        console.error('Unable to confirm attendance at calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }
    return updatedUser;
  }

  @Authorized(Permission.RsvpDelete)
  @Mutation(() => Boolean)
  async deleteRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    const { event, user } = await prisma.event_users.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      select: {
        user: { select: { email: true } },
        event: {
          select: {
            calendar_event_id: true,
            chapter: {
              select: { calendar_id: true },
            },
          },
        },
      },
    });

    const calendarId = event.chapter.calendar_id;
    const calendarEventId = event.calendar_event_id;

    if (calendarId && calendarEventId) {
      try {
        await removeEventAttendee(
          { calendarId, calendarEventId },
          { attendeeEmail: user.email },
        );
      } catch (e) {
        console.error('Unable to remove attendee from calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }

    return true;
  }

  @Authorized(Permission.EventCreate)
  @Mutation(() => Event)
  async createEvent(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('data') data: EventInputs,
    @Arg('attendEvent', () => Boolean) attendEvent: boolean,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<Event | null> {
    const venue = data.venue_id
      ? await prisma.venues.findUnique({ where: { id: data.venue_id } })
      : null;

    const chapter = await prisma.chapters.findUniqueOrThrow({
      where: { id: chapterId },
    });

    const eventSponsorsData: Prisma.event_sponsorsCreateManyEventInput[] =
      data.sponsor_ids.map((sponsor_id) => ({
        sponsor_id,
      }));

    // if attending, this will be used to create the RSVP
    const eventUserData: Prisma.event_usersCreateWithoutEventInput = {
      user: { connect: { id: ctx.user.id } },
      event_role: { connect: { name: 'member' } },
      rsvp: { connect: { name: 'yes' } },
      subscribed: true,
    };

    // TODO: the type safety if we start with ...data is a bit weak here: it
    // does not correctly check if data has all the required properties
    // (presumably because we're adding extras). Can we use the ...data shortcut
    // and keep the type safety?
    const eventData: Prisma.eventsCreateInput = {
      // ...data,
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      image_url: data.image_url,
      invite_only: data.invite_only,
      streaming_url: isOnline(data.venue_type) ? data.streaming_url : null,
      venue_type: data.venue_type,
      url: data.url ?? null,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      venue:
        isPhysical(data.venue_type) && data.venue_id !== TBD_VENUE_ID
          ? { connect: { id: venue?.id } }
          : {},
      chapter: { connect: { id: chapter.id } },
      sponsors: {
        createMany: { data: eventSponsorsData },
      },
      ...(attendEvent && { event_users: { create: eventUserData } }),
    };

    const event = await prisma.events.create({
      data: eventData,
    });

    // TODO: handle the case where the calendar_id doesn't exist. Warn the user?
    if (chapter.calendar_id) {
      await createCalendarEventHelper({
        attendeeEmails: attendEvent ? [ctx.user.email] : [],
        calendarId: chapter.calendar_id,
        event,
      });
    }

    return event;
  }

  @Authorized(Permission.EventCreate)
  @Mutation(() => Event)
  async createCalendarEvent(@Arg('id', () => Int) id: number): Promise<Event> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id },
      include: { chapter: true, event_users: { include: { user: true } } },
    });
    if (event.calendar_event_id) return event;
    if (!event.chapter.calendar_id) {
      throw Error(
        'Calendar events cannot be created when chapter does not have a Google calendar',
      );
    }

    const attendeeEmails =
      event.event_users.map(({ user: { email } }) => email) ?? [];
    const updatedEvent = await createCalendarEventHelper({
      attendeeEmails,
      calendarId: event.chapter.calendar_id,
      event,
    });
    return updatedEvent ? updatedEvent : event;
  }

  @Authorized(Permission.EventEdit)
  @Mutation(() => Event)
  async updateEvent(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: EventInputs,
  ): Promise<Event | null> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id },
      include: {
        venue: true,
        sponsors: true,
        event_users: {
          include: { user: true, event_reminder: true },
          where: { subscribed: true },
        },
      },
    });

    const eventSponsorInput: Prisma.event_sponsorsCreateManyInput[] =
      data.sponsor_ids.map((sId) => ({
        event_id: id,
        sponsor_id: sId,
      }));
    // TODO: if possible, replace (i.e. delete and create replacements in a
    // batch)
    await prisma.event_sponsors.deleteMany({ where: { event_id: id } });
    await prisma.event_sponsors.createMany({
      data: eventSponsorInput,
    });

    const update = getUpdateData(data, event);

    updateReminders(event, update.start_at);

    const hasEventDataChanged =
      hasVenueLocationChanged(data, event) ||
      hasDateChanged(data, event) ||
      hasStreamingUrlChanged(data, event);

    if (hasEventDataChanged) {
      createEmailForSubscribers(buildEmailForUpdatedEvent(data, event), event);
    }

    const updatedEvent = await prisma.events.update({
      where: { id },
      data: update,
      include: {
        chapter: { select: { calendar_id: true } },
        event_users: { include: { user: { select: { email: true } } } },
      },
    });

    // TODO: warn the user if the any calendar ids are missing
    if (updatedEvent.chapter.calendar_id && updatedEvent.calendar_event_id) {
      const createMeet =
        isOnline(data.venue_type) && !isOnline(event.venue_type);
      const removeMeet =
        isOnline(event.venue_type) && !isOnline(data.venue_type);
      try {
        await updateCalendarEventDetails(
          {
            calendarId: updatedEvent.chapter.calendar_id,
            calendarEventId: updatedEvent.calendar_event_id,
          },
          {
            summary: updatedEvent.name,
            start: updatedEvent.start_at,
            end: updatedEvent.ends_at,
            createMeet,
            removeMeet,
          },
        );
      } catch (e) {
        console.error('Unable to update calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }

    return updatedEvent;
  }

  @Authorized(Permission.EventEdit)
  @Mutation(() => Event)
  async cancelEvent(@Arg('id', () => Int) id: number): Promise<Event | null> {
    const event = await prisma.events.update({
      where: { id },
      data: { canceled: true },
      include: {
        chapter: { select: { id: true, name: true, calendar_id: true } },
        event_users: {
          include: { user: true },
          where: {
            subscribed: true,
            rsvp: { name: { not: 'no' } },
          },
        },
      },
    });
    await deleteEventReminders(id);
    const notCanceledRsvps = event.event_users;

    if (notCanceledRsvps.length) {
      for (const { user } of notCanceledRsvps) {
        const unsubscribeOptions = eventUnsubscribeOptions({
          chapterId: event.chapter_id,
          eventId: event.id,
          userId: user.id,
        });
        const emailList = notCanceledRsvps.map(({ user }) => user.email);
        const subject = `Event ${event.name} is canceled`;

        const cancelEventEmail = `The upcoming event ${event.name} has been canceled.<br />
          <br />
          View upcoming events for ${event.chapter.name}: <a href='${process.env.CLIENT_LOCATION}/chapters/${event.chapter.id}'>${event.chapter.name} chapter</a>.<br />
          You received this email because you Subscribed to ${event.name} Event.<br />
          <br />
          ${unsubscribeOptions}
          `;

        mailerService.sendEmail({
          emailList: emailList,
          subject: subject,
          htmlEmail: cancelEventEmail,
        });
      }
    }
    if (event.chapter.calendar_id && event.calendar_event_id) {
      try {
        // TODO: consider not awaiting. Ideally the user would see the app
        // respond immediately, but be informed of any failures later.
        // Client-side this could be handled by something like redux-saga, but
        // I'm not sure how to approach that server-side.
        await deleteCalendarEvent({
          calendarId: event.chapter.calendar_id,
          calendarEventId: event.calendar_event_id,
        });
      } catch (e) {
        console.error('Unable to cancel calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }

    return event;
  }

  @Authorized(Permission.EventDelete)
  @Mutation(() => Event)
  async deleteEvent(@Arg('id', () => Int) id: number): Promise<Event> {
    const event = await prisma.events.delete({
      where: { id },
      include: {
        chapter: { select: { calendar_id: true } },
      },
    });

    if (event.chapter.calendar_id && event.calendar_event_id) {
      try {
        // TODO: consider not awaiting. Ideally the user would see the app
        // respond immediately, but be informed of any failures later.
        // Client-side this could be handled by something like redux-saga, but
        // I'm not sure how to approach that server-side.
        await deleteCalendarEvent({
          calendarId: event.chapter.calendar_id,
          calendarEventId: event.calendar_event_id,
        });
      } catch (e) {
        console.error('Unable to delete calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }
    return event;
  }

  // TODO: This will need a real GraphQL return type (AFAIK you have to return
  // an object type)
  @Authorized(Permission.EventSendInvite)
  @Mutation(() => Boolean)
  async sendEventInvite(@Arg('id', () => Int) id: number): Promise<boolean> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id },
      include: {
        venue: true,
        chapter: {
          include: {
            chapter_users: { include: { user: true } },
            user_bans: true,
          },
        },
      },
    });

    const bannedUserIds = new Set(
      event.chapter.user_bans.map(({ user_id }) => user_id),
    );

    const users =
      event.chapter.chapter_users?.filter(
        ({ subscribed, user_id }) => !bannedUserIds.has(user_id) && subscribed,
      ) ?? [];

    if (!users.length) {
      return true;
    }
    const subject = `Invitation to ${event.name}.`;

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapter.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}`;
    const confirmRsvpQuery = '?confirm_attendance=true';
    const description = event.description
      ? `About the event: <br />
    ${event.description}${SPACER}`
      : '';

    const subsequentEventEmail = `Upcoming event for ${
      event.chapter.name
    }.<br />
    <br />
    When: ${event.start_at} to ${event.ends_at}
    <br />
    ${
      isPhysical(event.venue_type) &&
      `Where: ${event.venue?.name || TBD}.<br />`
    }
    ${
      isOnline(event.venue_type) &&
      `Streaming URL: ${event.streaming_url || TBD}<br />`
    }
    <br />
    Go to <a href="${eventURL}${confirmRsvpQuery}">the event page</a> to confirm your attendance.${SPACER}
    ${description}
    View all upcoming events for ${
      event.chapter.name
    }: <a href='${chapterURL}'>${event.chapter.name} chapter</a>.<br />
    <br />
    `;

    await batchSender(function* () {
      for (const { user } of users) {
        const email = user.email;
        const unsubscribeOptions = chapterUnsubscribeOptions({
          chapterId: event.chapter_id,
          userId: user.id,
        });
        const text = `${subsequentEventEmail}<br />${unsubscribeOptions}<br />`;
        yield { email, subject, text };
      }
    });

    return true;
  }
}
