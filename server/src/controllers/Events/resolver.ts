import { inspect } from 'util';
import {
  events,
  events_venue_type_enum,
  event_users,
  Prisma,
  attendance,
} from '@prisma/client';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { isEqual, sub } from 'date-fns';

import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';
import {
  Event,
  EventUserWithRelations,
  EventWithRelationsWithEventUserRelations,
  EventWithRelationsWithEventUser,
  EventWithVenue,
  User,
  PaginatedEventsWithChapters,
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
  testCalendarEventAccess,
  updateCalendarEventDetails,
} from '../../services/Google';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import {
  createCalendarEventHelper,
  integrationStatus,
} from '../../util/calendar';
import { updateWaitlistForUserRemoval } from '../../util/waitlist';
import { redactSecrets } from '../../util/redact-secrets';
import {
  AttachUnsubscribeData,
  buildEmailForUpdatedEvent,
  chapterAdminUnsubscribeOptions,
  eventAttendanceCancelation,
  eventAttendanceConfirmation,
  eventAttendanceRequest,
  eventAttendeeToWaitlistEmail,
  eventCancelationEmail,
  eventConfirmAttendeeEmail,
  eventInviteEmail,
  eventNewAttendeeNotifyEmail,
  eventWaitlistConfirmation,
  hasDateChanged,
  hasPhysicalLocationChanged,
  hasStreamingUrlChanged,
  hasVenueTypeChanged,
  sendUserEmail,
} from '../../util/event-email';
import { createTagsData } from '../../util/tags';
import { isOnline, isPhysical } from '../../util/venue';
import { AttendanceNames } from '../../../../common/attendance';
import { EventInputs } from './inputs';

const TBD_VENUE_ID = 0;

const eventUserIncludes = {
  user: true,
  attendance: true,
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

const createEmailForSubscribers = (
  buildEmail: {
    subject: string;
    emailText: string;
    attachUnsubscribe: AttachUnsubscribeData;
  },
  emaildata: EventWithUsers,
) => {
  const { subject, attachUnsubscribe } = buildEmail;
  batchSender(function* () {
    for (const { user } of emaildata.event_users) {
      const email = user.email;
      const text = attachUnsubscribe({
        chapterId: emaildata.chapter_id,
        eventId: emaildata.id,
        userId: emaildata.id,
      });
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
const attendeeNotifyAdministrators = async (
  attendingUser: User,
  chapterAdministrators: ChapterUser[],
  eventName: string,
) => {
  const { subject, attachUnsubscribeText } = eventNewAttendeeNotifyEmail({
    eventName,
    userName: attendingUser.name,
  });

  await batchSender(function* () {
    for (const { chapter_id, user } of chapterAdministrators) {
      const email = user.email;
      const unsubscribeOptions = chapterAdminUnsubscribeOptions({
        chapterId: chapter_id,
        userId: user.id,
      });
      const text = attachUnsubscribeText(unsubscribeOptions);
      yield { email, subject, text };
    }
  });
};

type EventAttendanceName = events & {
  event_users: (event_users & { attendance: attendance })[];
};
const getNameForNewAttendance = (event: EventAttendanceName) => {
  const going = event.event_users.filter(
    ({ attendance }) => attendance.name === AttendanceNames.confirmed,
  );
  const waitlist = going.length >= event.capacity;
  return event.invite_only || waitlist
    ? AttendanceNames.waitlist
    : AttendanceNames.confirmed;
};

@Resolver(() => Event)
export class EventResolver {
  @FieldResolver(() => Boolean)
  has_calendar_event(@Root() event: Event) {
    return typeof event.calendar_event_id === 'string';
  }

  @Query(() => PaginatedEventsWithChapters)
  async paginatedEventsWithTotal(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
    @Arg('showOnlyUpcoming', () => Boolean, { nullable: true })
    showOnlyUpcoming = true,
  ): Promise<PaginatedEventsWithChapters> {
    const total = await prisma.events.count({
      ...(showOnlyUpcoming && {
        where: {
          canceled: false,
          ends_at: { gt: new Date() },
        },
      }),
    });
    const events = await prisma.events.findMany({
      ...(showOnlyUpcoming && {
        where: {
          canceled: false,
          ends_at: { gt: new Date() },
        },
      }),
      include: {
        chapter: true,
        event_tags: { include: { tag: true } },
      },
      orderBy: [{ start_at: 'asc' }, { name: 'asc' }],
      take: limit ?? 10,
      skip: offset,
    });
    return { total, events };
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
        event_tags: { include: { tag: true } },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Authorized(Permission.EventsView)
  @Query(() => [EventWithVenue])
  async dashboardEvents(
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventWithVenue[]> {
    return await prisma.events.findMany({
      where: {
        ...(!isAdminFromInstanceRole(ctx.user) && {
          chapter: isChapterAdminWhere(ctx.user.id),
        }),
      },
      include: { venue: true, event_tags: { include: { tag: true } } },
      orderBy: [{ start_at: 'desc' }, { name: 'asc' }],
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
            attendance: true,
          },
          orderBy: { user: { name: 'asc' } },
        },
        event_tags: { include: { tag: true } },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Authorized(Permission.AttendeeAttend)
  @Mutation(() => EventUserWithRelations)
  async attendEvent(
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

    const chapterAdministrators = await prisma.chapter_users.findMany({
      where: {
        chapter_id: chapterId,
        subscribed: true,
        chapter_role: {
          chapter_role_permissions: {
            some: {
              chapter_permission: { name: 'chapter-edit' },
            },
          },
        },
      },
      ...chapterUserInclude,
    });

    const oldEventUser = await prisma.event_users.findUnique({
      include: { attendance: true },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });

    const newAttendanceName = getNameForNewAttendance(event);

    let eventUser: EventUserWithRelations;
    if (oldEventUser) {
      if (
        [
          AttendanceNames.confirmed.valueOf(),
          AttendanceNames.waitlist.valueOf(),
        ].includes(oldEventUser.attendance.name)
      ) {
        throw Error('Already attending');
      }

      eventUser = await prisma.event_users.update({
        data: {
          attendance: { connect: { name: newAttendanceName } },
          joined_date: new Date(),
        },
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
        attendance: { connect: { name: newAttendanceName } },
        event_role: { connect: { name: 'member' } },
        subscribed: true,
      };
      eventUser = await prisma.event_users.create({
        data: eventUserData,
        include: eventUserIncludes,
      });

      // NOTE: this relies on there being an event_user record, so must follow
      // that.
      if (newAttendanceName !== AttendanceNames.waitlist) {
        await createReminder({
          eventId,
          remindAt: sub(event.start_at, { days: 1 }),
          userId: ctx.user.id,
        });
      }
    }

    const isAttendee = newAttendanceName === AttendanceNames.confirmed;
    if (isAttendee) {
      const calendarEventId = event.calendar_event_id;
      const calendarId = event.chapter.calendar_id;
      if (calendarId && calendarEventId && (await integrationStatus())) {
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
    }

    await sendUserEmail({
      emailData: isAttendee
        ? eventAttendanceConfirmation
        : event.invite_only
        ? eventAttendanceRequest
        : eventWaitlistConfirmation,
      event,
      user: ctx.user,
    });

    await attendeeNotifyAdministrators(
      ctx.user,
      chapterAdministrators,
      event.name,
    );
    return eventUser;
  }

  @Authorized(Permission.AttendeeAttend)
  @Mutation(() => EventUserWithRelations, { nullable: true })
  async cancelAttendance(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUserWithRelations | null> {
    const eventUser = await prisma.event_users.findUniqueOrThrow({
      include: { attendance: true, event_reminder: true },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });
    if (eventUser.attendance.name === AttendanceNames.canceled) {
      throw Error('Attendance is already canceled');
    }

    const event = await prisma.events.findUniqueOrThrow({
      where: { id: eventId },
      include: {
        event_users: {
          include: eventUserIncludes,
          orderBy: { joined_date: 'asc' },
        },
        venue: true,
        chapter: { select: { calendar_id: true } },
      },
    });

    await updateWaitlistForUserRemoval({ event, userId: ctx.user.id });

    const updatedEventUser = await prisma.event_users.update({
      data: {
        attendance: { connect: { name: AttendanceNames.canceled } },
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

    await sendUserEmail({
      emailData: eventAttendanceCancelation,
      event,
      user: updatedEventUser.user,
    });

    const calendarId = event.chapter.calendar_id;
    const calendarEventId = event.calendar_event_id;

    if (calendarId && calendarEventId && (await integrationStatus())) {
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

  @Authorized(Permission.AttendeeConfirm)
  @Mutation(() => EventUserWithRelations)
  async confirmAttendee(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<EventUserWithRelations> {
    const updatedUser = await prisma.event_users.update({
      data: { attendance: { connect: { name: AttendanceNames.confirmed } } },
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: {
        event: { include: { chapter: true, venue: true } },
        ...eventUserIncludes,
      },
    });

    const { subject, attachUnsubscribe } = eventConfirmAttendeeEmail(
      updatedUser.event,
    );

    await mailerService.sendEmail({
      emailList: [updatedUser.user.email],
      subject,
      htmlEmail: attachUnsubscribe({
        chapterId: updatedUser.event.chapter_id,
        eventId: updatedUser.event_id,
        userId,
      }),
    });

    const calendarId = updatedUser.event.chapter.calendar_id;
    const calendarEventId = updatedUser.event.calendar_event_id;

    if (calendarId && calendarEventId && (await integrationStatus())) {
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

  @Authorized(Permission.AttendeeConfirm)
  @Mutation(() => EventUserWithRelations)
  async moveAttendeeToWaitlist(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<EventUserWithRelations> {
    const updatedUser = await prisma.event_users.update({
      data: { attendance: { connect: { name: AttendanceNames.waitlist } } },
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: { event: { include: { chapter: true } }, ...eventUserIncludes },
    });

    const { subject, attachUnsubscribe } = eventAttendeeToWaitlistEmail(
      updatedUser.event.name,
    );

    await mailerService.sendEmail({
      emailList: [updatedUser.user.email],
      subject,
      htmlEmail: attachUnsubscribe({
        chapterId: updatedUser.event.chapter_id,
        eventId: updatedUser.event_id,
        userId,
      }),
    });

    const calendarId = updatedUser.event.chapter.calendar_id;
    const calendarEventId = updatedUser.event.calendar_event_id;

    if (calendarId && calendarEventId && (await integrationStatus())) {
      try {
        await removeEventAttendee(
          { calendarId, calendarEventId },
          { attendeeEmail: updatedUser.user.email },
        );
      } catch (e) {
        console.error('Unable to move attendee to waitlist at calendar event');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }
    return updatedUser;
  }

  @Authorized(Permission.AttendeeDelete)
  @Mutation(() => Boolean)
  async deleteAttendee(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    const { attendance, event, user } = await prisma.event_users.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: {
        attendance: true,
        event: {
          include: {
            chapter: { select: { calendar_id: true } },
            event_users: {
              include: { attendance: true, user: true },
              orderBy: { joined_date: 'asc' },
            },
            venue: true,
          },
        },
        user: { select: { email: true } },
      },
    });

    if (attendance.name === AttendanceNames.confirmed) {
      await updateWaitlistForUserRemoval({ event, userId });
    }

    const calendarId = event.chapter.calendar_id;
    const calendarEventId = event.calendar_event_id;

    if (calendarId && calendarEventId && (await integrationStatus())) {
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

    // if attending, this will be used to create the event_user
    const eventUserData: Prisma.event_usersCreateWithoutEventInput = {
      user: { connect: { id: ctx.user.id } },
      event_role: { connect: { name: 'member' } },
      attendance: { connect: { name: AttendanceNames.confirmed } },
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
      event_tags: createTagsData(data.event_tags),
      ...(attendEvent && { event_users: { create: eventUserData } }),
    };

    const event = await prisma.events.create({
      data: eventData,
    });

    // TODO: handle the case where the calendar_id doesn't exist. Warn the user?
    if (chapter.calendar_id && (await integrationStatus())) {
      const calendarCreation = await createCalendarEventHelper({
        attendeeEmails: attendEvent ? [ctx.user.email] : [],
        calendarId: chapter.calendar_id,
        event,
      });
      return {
        ...event,
        calendar_event_id: calendarCreation?.calendar_event_id,
      };
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
    const calendarStatus = await integrationStatus();
    if (event.calendar_event_id || !calendarStatus) return event;
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
          include: { attendance: true, event_reminder: true, user: true },
          where: { subscribed: true },
        },
      },
    });

    if (
      event.event_users.filter(
        ({ attendance: { name } }) => name === AttendanceNames.confirmed,
      ).length > data.capacity
    )
      throw Error(
        'Capacity must be higher or equal to the number of confirmed attendees',
      );

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

    await prisma.$transaction([
      prisma.events.update({
        where: { id },
        data: { event_tags: { deleteMany: {} } },
      }),
      prisma.events.update({
        where: { id },
        data: { event_tags: createTagsData(data.event_tags) },
      }),
    ]);

    const update = getUpdateData(data, event);

    updateReminders(event, update.start_at);

    const updatedEvent = await prisma.events.update({
      where: { id },
      data: update,
      include: {
        chapter: { select: { calendar_id: true } },
        event_users: { include: { user: { select: { email: true } } } },
        venue: true,
      },
    });

    const hasEventDataChanged =
      hasVenueTypeChanged(updatedEvent, event) ||
      hasPhysicalLocationChanged(updatedEvent, event) ||
      hasDateChanged(updatedEvent, event) ||
      hasStreamingUrlChanged(updatedEvent, event);

    if (hasEventDataChanged) {
      createEmailForSubscribers(
        buildEmailForUpdatedEvent({ newData: updatedEvent, oldData: event }),
        event,
      );
    }

    // TODO: warn the user if the any calendar ids are missing
    if (
      updatedEvent.chapter.calendar_id &&
      updatedEvent.calendar_event_id &&
      (await integrationStatus())
    ) {
      const createMeet =
        isOnline(updatedEvent.venue_type) && !isOnline(event.venue_type);
      const removeMeet =
        isOnline(event.venue_type) && !isOnline(updatedEvent.venue_type);
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
            attendance: { name: { not: AttendanceNames.canceled } },
          },
        },
      },
    });
    await deleteEventReminders(id);
    const notCanceledAttendees = event.event_users;

    const { subject, attachUnsubscribe } = eventCancelationEmail(event);

    if (notCanceledAttendees.length) {
      for (const { user } of notCanceledAttendees) {
        const emailList = notCanceledAttendees.map(({ user }) => user.email);
        const cancelEventEmail = attachUnsubscribe({
          chapterId: event.chapter_id,
          eventId: event.id,
          userId: user.id,
        });

        mailerService.sendEmail({
          emailList: emailList,
          subject,
          htmlEmail: cancelEventEmail,
        });
      }
    }
    if (
      event.chapter.calendar_id &&
      event.calendar_event_id &&
      (await integrationStatus())
    ) {
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

    if (
      event.chapter.calendar_id &&
      event.calendar_event_id &&
      (await integrationStatus())
    ) {
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

    const { subject, attachUnsubscribe } = eventInviteEmail(event);

    await batchSender(function* () {
      for (const { user } of users) {
        const email = user.email;
        const text = attachUnsubscribe({
          chapterId: event.chapter_id,
          userId: user.id,
        });
        yield { email, subject, text };
      }
    });

    return true;
  }

  @Authorized(Permission.EventCreate)
  @Query(() => Boolean, { nullable: true })
  async testEventCalendarEventAccess(
    @Arg('id', () => Int) id: number,
  ): Promise<boolean | null> {
    const event = await prisma.events.findUniqueOrThrow({
      where: { id },
      include: { chapter: { select: { calendar_id: true } } },
    });
    if (!event.calendar_event_id || !event.chapter.calendar_id) return null;
    try {
      return await testCalendarEventAccess({
        calendarId: event.chapter.calendar_id,
        calendarEventId: event.calendar_event_id,
      });
    } catch (err) {
      return null;
    }
  }

  @Authorized(Permission.EventCreate)
  @Mutation(() => Event)
  async unlinkCalendarEvent(@Arg('id', () => Int) id: number): Promise<Event> {
    return await prisma.events.update({
      data: { calendar_event_id: null },
      where: { id },
    });
  }
}
