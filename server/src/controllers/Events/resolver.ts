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
import ical from 'ical-generator';

import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';
import {
  Event,
  EventUser,
  EventWithRelations,
  EventWithChapter,
  User,
  PaginatedEventsWithTotal,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import MailerService, { batchSender } from '../../services/MailerService';
import {
  createReminder,
  deleteEventReminders,
  updateRemindAt,
} from '../../services/Reminders';
import {
  generateToken,
  UnsubscribeType,
} from '../../services/UnsubscribeToken';
import {
  cancelCalendarEvent,
  createCalendarEvent,
  deleteCalendarEvent,
  patchCalendarEvent,
  updateCalendarEvent,
} from '../../services/Google';
import { EventInputs } from './inputs';

const eventUserIncludes = {
  user: true,
  rsvp: true,
  event_role: {
    include: {
      event_role_permissions: { include: { event_permission: true } },
    },
  },
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

const isPhysical = (venue_type: events_venue_type_enum) =>
  venue_type !== events_venue_type_enum.Online;
const isOnline = (venue_type: events_venue_type_enum) =>
  venue_type !== events_venue_type_enum.Physical;

const getUnsubscribeOptions = ({
  chapterId,
  eventId,
  userId,
}: {
  chapterId: number;
  eventId: number;
  userId: number;
}) => {
  const chapterUnsubscribeToken = generateToken(
    UnsubscribeType.Chapter,
    chapterId,
    userId,
  );
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    eventId,
    userId,
  );
  return `
Unsubscribe Options</br>
- <a href="${process.env.CLIENT_LOCATION}/unsubscribe?token=${eventUnsubscribeToken}">Attend this event, but only turn off future notifications for this event</a></br>
- Or, <a href="${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken}">stop receiving all notifications by unfollowing chapter</a>`;
};

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

  const unsubscribeOptions = getUnsubscribeOptions({
    chapterId: event.chapter_id,
    eventId: event.id,
    userId: user.id,
  });

  await new MailerService({
    emailList: [user.email],
    subject: `Invitation: ${event.name}`,
    htmlEmail: `Hi ${user.name},</br>
To add this event to your calendar(s) you can use these links:
</br>
<a href=${google(linkDetails)}>Google</a>
</br>
<a href=${outlook(linkDetails)}>Outlook</a>

${unsubscribeOptions}
      `,
  }).sendEmail();
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

const hasVenueChanged = (data: EventInputs, event: EventWithUsers) =>
  data.venue_type !== event.venue_type ||
  (isOnline(event.venue_type) && data.streaming_url !== event.streaming_url) ||
  (isPhysical(event.venue_type) && data.venue_id !== event.venue_id);

const buildEmailForUpdatedEvent = async (
  data: EventInputs,
  event: EventWithUsers,
) => {
  const subject = `Venue changed for event ${event.name}`;
  let venueDetails = '';

  if (isPhysical(event.venue_type)) {
    const venue = await prisma.venues.findUniqueOrThrow({
      where: { id: data.venue_id },
    });
    // TODO: include a link back to the venue page
    venueDetails += `The event is now being held at <br>
${venue.name} <br>
${venue.street_address ? venue.street_address + '<br>' : ''}
${venue.city} <br>
${venue.region} <br>
${venue.postal_code} <br>
`;
  }

  if (isOnline(event.venue_type)) {
    venueDetails += `Streaming URL: ${data.streaming_url}<br>`;
  }
  // TODO: include a link back to the venue page
  const body = `We have had to change the location of ${event.name}.<br>
${venueDetails}`;
  return { subject, body };
};

const getUpdateData = (data: EventInputs, event: EventWithUsers) => {
  const getVenueData = (data: EventInputs, event: EventWithUsers) => ({
    streaming_url: isOnline(event.venue_type)
      ? data.streaming_url ?? event.streaming_url
      : null,
    venue: isPhysical(event.venue_type)
      ? { connect: { id: data.venue_id } }
      : { disconnect: true },
  });

  const update = {
    invite_only: data.invite_only ?? event.invite_only,
    name: data.name ?? event.name,
    description: data.description ?? event.description,
    url: data.url, // allows url deletion
    start_at: new Date(data.start_at) ?? event.start_at,
    ends_at: new Date(data.ends_at) ?? event.ends_at,
    capacity: data.capacity ?? event.capacity,
    image_url: data.image_url ?? event.image_url,
    venue_type: data.venue_type ?? event.venue_type,
    ...getVenueData(data, event),
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
  const subject = `New RSVP for ${eventName}`;
  const body = `User ${rsvpingUser.name} has RSVP'd.`;

  await batchSender(function* () {
    for (const { chapter_id, user } of chapterAdministrators) {
      const email = user.email;
      const chapterUnsubscribeToken = generateToken(
        UnsubscribeType.Chapter,
        chapter_id,
        user.id,
      );
      const text = `${body}<br><a href="${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken}Unsubscribe from chapter emails`;
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

const updateCalendarEventAttendees = async ({
  eventId,
  calendarId,
  calendarEventId,
}: {
  eventId: number;
  calendarId: string | null;
  calendarEventId: string | null;
}) => {
  const attendees = await prisma.event_users.findMany({
    where: {
      event_id: eventId,
      rsvp: { name: 'yes' },
    },
    select: { user: { select: { email: true } } },
  });

  if (calendarId && calendarEventId) {
    try {
      // Patch is necessary here, since an update with unchanged start and end
      // will remove attendees' yes/no/maybe response without notifying them.
      await patchCalendarEvent({
        calendarId,
        calendarEventId,
        attendeeEmails: attendees.map(({ user }) => user.email),
      });
    } catch {
      // TODO: log more details without leaking tokens and user info.
      throw 'Unable to update calendar event attendees';
    }
  }
};

@Resolver()
export class EventResolver {
  @Query(() => [EventWithRelations])
  async events(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('showAll', { nullable: true }) showAll?: boolean,
  ): Promise<EventWithRelations[]> {
    return await prisma.events.findMany({
      where: {
        ...(!showAll && { start_at: { gt: new Date() } }),
      },
      include: {
        chapter: true,
        venue: true,
        event_users: {
          include: {
            user: true,
            rsvp: true,
            event_role: {
              include: {
                event_role_permissions: { include: { event_permission: true } },
              },
            },
          },
        },
        sponsors: { include: { sponsor: true } }, // TODO: remove this, ideally "Omit" it, if TypeGraphQL supports that.
      },
      take: limit,
      orderBy: {
        start_at: 'asc',
      },
    });
  }

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

  // TODO: Check we need all the returned data
  @Authorized(Permission.EventEdit)
  @Query(() => EventWithRelations, { nullable: true })
  async dashboardEvent(
    @Arg('eventId', () => Int) eventId: number,
  ): Promise<EventWithRelations | null> {
    return await prisma.events.findUnique({
      where: { id: eventId },
      include: {
        chapter: true,
        venue: true,
        event_users: {
          include: {
            user: true,
            rsvp: true,
            event_role: {
              include: {
                event_role_permissions: { include: { event_permission: true } },
              },
            },
          },
          orderBy: { user: { name: 'asc' } },
        },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  // TODO: Check we need all the returned data
  @Query(() => EventWithRelations, { nullable: true })
  async event(
    @Arg('eventId', () => Int) eventId: number,
  ): Promise<EventWithRelations | null> {
    return await prisma.events.findUnique({
      where: { id: eventId },
      include: {
        chapter: true,
        venue: true,
        event_users: {
          include: {
            user: true,
            rsvp: true,
            event_role: {
              include: {
                event_role_permissions: { include: { event_permission: true } },
              },
            },
          },
          orderBy: { user: { name: 'asc' } },
        },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Authorized(Permission.Rsvp)
  @Mutation(() => EventUser)
  async rsvpEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUser> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id: eventId },
      include: {
        event_users: {
          include: eventUserIncludes,
        },
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

    const isSubscribedToChapter =
      ctx.user.user_chapters.find(
        (user_chapter) => user_chapter.chapter_id === chapterId,
      )?.subscribed ?? true;

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

    let eventUser: EventUser;
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
        subscribed: isSubscribedToChapter,
      };
      eventUser = await prisma.event_users.create({
        data: eventUserData,
        include: eventUserIncludes,
      });

      // NOTE: this relies on there being an event_user record, so must follow
      // that.
      if (newRsvpName !== 'waitlist' && isSubscribedToChapter) {
        await createReminder({
          eventId,
          remindAt: sub(event.start_at, { days: 1 }),
          userId: ctx.user.id,
        });
      }
    }

    // The calendar must be updated after event_users, so it can use the updated
    // email list
    await updateCalendarEventAttendees({
      calendarEventId: event.calendar_event_id,
      calendarId: event.chapter.calendar_id,
      eventId,
    });

    await sendRsvpInvitation(ctx.user, event);
    await rsvpNotifyAdministrators(ctx.user, chapterAdministrators, event.name);
    return eventUser;
  }

  @Authorized(Permission.Rsvp)
  @Mutation(() => EventUser, { nullable: true })
  async cancelRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUser | null> {
    const eventUser = await prisma.event_users.findUniqueOrThrow({
      include: { rsvp: true },
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
        event_users: {
          include: eventUserIncludes,
        },
        venue: true,
        chapter: { select: { calendar_id: true } },
      },
    });

    if (!event.invite_only && eventUser.rsvp.name !== 'waitlist') {
      const waitList = event.event_users.filter(
        ({ rsvp, user_id }) =>
          user_id !== eventUser.user_id && rsvp.name === 'waitlist',
      );

      if (waitList.length) {
        const acceptedRsvp = waitList[0];
        await prisma.event_users.update({
          data: { rsvp: { connect: { name: 'yes' } } },
          where: {
            user_id_event_id: {
              user_id: acceptedRsvp.user_id,
              event_id: acceptedRsvp.event_id,
            },
          },
        });

        if (acceptedRsvp.subscribed) {
          await createReminder({
            eventId: acceptedRsvp.event_id,
            remindAt: sub(event.start_at, { days: 1 }),
            userId: acceptedRsvp.user_id,
          });
          // TODO add email about being off waitlist?
        }
      }
    }

    const updatedEventUser = await prisma.event_users.update({
      data: { rsvp: { connect: { name: 'no' } } },
      include: eventUserIncludes,
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });

    // The calendar must be updated after event_users, so it can use the updated
    // email list
    await updateCalendarEventAttendees({
      calendarEventId: event.calendar_event_id,
      calendarId: event.chapter.calendar_id,
      eventId,
    });
    return updatedEventUser;
  }

  @Authorized(Permission.RsvpConfirm)
  @Mutation(() => EventUser)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<EventUser> {
    const updatedUser = await prisma.event_users.update({
      data: { rsvp: { connect: { name: 'yes' } } },
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: { event: { include: { chapter: true } }, ...eventUserIncludes },
    });

    const unsubscribeOptions = getUnsubscribeOptions({
      chapterId: updatedUser.event.chapter_id,
      eventId: updatedUser.event_id,
      userId,
    });

    await new MailerService({
      emailList: [updatedUser.user.email],
      subject: 'Your RSVP is confirmed',
      htmlEmail: `Your reservation is confirmed. You can attend the event ${updatedUser.event.name}
${unsubscribeOptions}`,
    }).sendEmail();

    // The calendar must be updated after event_users, so it can use the updated
    // email list
    await updateCalendarEventAttendees({
      calendarEventId: updatedUser.event.calendar_event_id,
      calendarId: updatedUser.event.chapter.calendar_id,
      eventId,
    });
    return updatedUser;
  }

  @Authorized(Permission.RsvpDelete)
  @Mutation(() => Boolean)
  async deleteRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    const { event } = await prisma.event_users.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      select: {
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

    // The calendar must be updated after event_users, so it can use the updated
    // email list
    await updateCalendarEventAttendees({
      calendarEventId: event.calendar_event_id,
      calendarId: event.chapter.calendar_id,
      eventId,
    });

    return true;
  }

  @Authorized(Permission.EventCreate)
  @Mutation(() => Event)
  async createEvent(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('data') data: EventInputs,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<Event | null> {
    let venue;
    if (data.venue_id) {
      venue = await prisma.venues.findUnique({ where: { id: data.venue_id } });
    }

    const chapter = await prisma.chapters.findUniqueOrThrow({
      where: { id: chapterId },
    });
    const userChapter = ctx.user.user_chapters.find(
      ({ chapter_id }) => chapter_id === chapterId,
    );

    const eventSponsorsData: Prisma.event_sponsorsCreateManyEventInput[] =
      data.sponsor_ids.map((sponsor_id) => ({
        sponsor_id,
      }));

    const isSubscribedToEvent = userChapter ? userChapter.subscribed : true; // TODO add default event subscription setting override

    // TODO: add an option to allow event creators NOT to rsvp. If doing that
    // make sure stop adding them to the calendar event.
    const eventUserData: Prisma.event_usersCreateWithoutEventInput = {
      user: { connect: { id: ctx.user.id } },
      event_role: { connect: { name: 'member' } },
      rsvp: { connect: { name: 'yes' } },
      subscribed: isSubscribedToEvent,
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
      venue: isPhysical(data.venue_type) ? { connect: { id: venue?.id } } : {},
      chapter: { connect: { id: chapter.id } },
      sponsors: {
        createMany: { data: eventSponsorsData },
      },
      event_users: {
        create: eventUserData,
      },
    };

    const event = await prisma.events.create({
      data: eventData,
    });

    // TODO: handle the case where the calendar_id doesn't exist. Warn the user?
    if (chapter.calendar_id) {
      try {
        const { calendarEventId } = await createCalendarEvent({
          calendarId: chapter.calendar_id,
          start: event.start_at,
          end: event.ends_at,
          summary: event.name,
          attendeeEmails: [ctx.user.email],
        });

        await prisma.events.update({
          where: {
            id: event.id,
          },
          data: {
            calendar_event_id: calendarEventId,
          },
        });
      } catch {
        // TODO: log more details without leaking tokens and user info.
        console.error('Unable to create calendar event');
      }
    }

    return event;
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

    if (hasVenueChanged(data, event)) {
      const { body, subject } = await buildEmailForUpdatedEvent(data, event);
      batchSender(function* () {
        for (const { user } of event.event_users) {
          const email = user.email;
          const unsubScribeOptions = getUnsubscribeOptions({
            chapterId: event.chapter_id,
            eventId: event.id,
            userId: user.id,
          });
          const text = `${body}<br>${unsubScribeOptions}`;
          yield { email, subject, text };
        }
      });
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
      try {
        await updateCalendarEvent({
          calendarId: updatedEvent.chapter.calendar_id,
          calendarEventId: updatedEvent.calendar_event_id,
          summary: updatedEvent.name,
          start: updatedEvent.start_at,
          end: updatedEvent.ends_at,
          attendeeEmails: updatedEvent.event_users.map(
            ({ user }) => user.email,
          ),
        });
      } catch {
        // TODO: log more details without leaking tokens and user info.
        console.error('Unable to update calendar event');
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
        chapter: { select: { calendar_id: true } },
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
      const emailList = notCanceledRsvps.map(({ user }) => user.email);
      const subject = `Event ${event.name} canceled`;
      const body = `The event ${event.name} was canceled`;

      new MailerService({
        emailList: emailList,
        subject: subject,
        htmlEmail: body,
      }).sendEmail();
    }

    if (event.chapter.calendar_id && event.calendar_event_id) {
      try {
        // TODO: consider not awaiting. Ideally the user would see the app
        // respond immediately, but be informed of any failures later.
        // Client-side this could be handled by something like redux-saga, but
        // I'm not sure how to approach that server-side.
        await cancelCalendarEvent({
          calendarId: event.chapter.calendar_id,
          calendarEventId: event.calendar_event_id,
          summary: event.name,
          start: event.start_at,
          end: event.ends_at,
          attendeeEmails: event.event_users.map(({ user }) => user.email),
        });
      } catch {
        // TODO: log more details without leaking tokens and user info.
        console.error('Unable to cancel calendar event');
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
      } catch {
        // TODO: log more details without leaking tokens and user info.
        console.error('Unable to delete calendar event');
      }
    }
    return event;
  }

  // TODO: This will need a real GraphQL return type (AFAIK you have to return
  // an object type)
  @Authorized(Permission.EventSendInvite)
  @Mutation(() => Boolean)
  async sendEventInvite(
    @Arg('id', () => Int) id: number,
    @Arg('emailGroups', () => [String], {
      nullable: true,
      defaultValue: ['interested'],
    })
    emailGroups: Array<'confirmed' | 'on_waitlist' | 'canceled' | 'interested'>,
  ): Promise<boolean> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id },
      include: {
        venue: true,
        chapter: { include: { chapter_users: { include: { user: true } } } },
        event_users: {
          include: { rsvp: true, user: true },
          where: { subscribed: true },
        },
      },
    });

    interface User {
      user: { id: number; email: string };
      subscribed: boolean;
    }

    const users: User[] = [];
    if (emailGroups.includes('interested')) {
      const interestedUsers =
        event.chapter.chapter_users?.filter((user) => user.subscribed) ?? [];

      users.push(...interestedUsers);
    }

    if (emailGroups.includes('on_waitlist')) {
      const waitlistUsers = event.event_users.filter(
        ({ rsvp }) => rsvp.name === 'waitlist',
      );
      users.push(...waitlistUsers);
    }
    if (emailGroups.includes('confirmed')) {
      const confirmedUsers = event.event_users.filter(
        ({ rsvp }) => rsvp.name === 'yes',
      );
      users.push(...confirmedUsers);
    }
    if (emailGroups.includes('canceled')) {
      const canceledUsers = event.event_users.filter(
        ({ rsvp }) => rsvp.name === 'no',
      );
      users.push(...canceledUsers);
    }

    if (!users.length) {
      return true;
    }
    const subject = `Invitation to ${event.name}.`;

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapter.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}?emaillink=true`;
    const calendar = ical();
    calendar.createEvent({
      start: event.start_at,
      end: event.ends_at,
      summary: event.name,
      url: eventURL,
    });

    const body = `When: ${event.start_at} to ${event.ends_at}<br>
${event.venue ? `Where: ${event.venue.name}<br>` : ''}
${event.streaming_url ? `Streaming URL: ${event.streaming_url}<br>` : ''}
Event Details: <a href="${eventURL}">${eventURL}</a><br>
    <br>
    - Cancel your RSVP: <a href="${eventURL}">${eventURL}</a><br>
    - More about ${
      event.chapter.name
    } or to unfollow this chapter: <a href="${chapterURL}">${chapterURL}</a><br>
    <br>
    ----------------------------<br>
    You received this email because you follow this chapter.<br>
    <br>
    See the options above to change your notifications.`;

    const iCalEvent = calendar.toString();

    await batchSender(function* () {
      for (const { user } of users) {
        const email = user.email;
        const unsubScribeOptions = getUnsubscribeOptions({
          chapterId: event.chapter_id,
          eventId: event.id,
          userId: user.id,
        });
        const text = `${body}<br>${unsubScribeOptions}`;
        yield { email, subject, text, options: { iCalEvent } };
      }
    });

    return true;
  }
}
