import { events_venue_type_enum, Prisma } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';

import { isEqual, sub } from 'date-fns';
import ical from 'ical-generator';

import { GQLCtx } from '../../common-types/gql';
import {
  Event,
  Rsvp,
  EventWithRelations,
  EventWithChapter,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import MailerService from '../../services/MailerService';
import { CreateEventInputs, UpdateEventInputs } from './inputs';

//Place holder for unsubscribe
//TODO: Replace placeholder with actual unsubscribe link
const unsubscribe = `<br/> <a href='https://www.freecodecamp.org/'> Unsubscribe</a>`;

const getUniqueTags = (tags: string[]) => [
  ...new Set(tags.map((tagName) => tagName.trim()).filter(Boolean)),
];
const isPhysical = (venue_type: events_venue_type_enum) =>
  venue_type !== events_venue_type_enum.Online;
const isOnline = (venue_type: events_venue_type_enum) =>
  venue_type !== events_venue_type_enum.Physical;

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
        tags: { include: { tag: true } },
        venue: true,
        rsvps: {
          include: { user: true },
        },
        sponsors: { include: { sponsor: true } }, // TODO: remove this, ideally "Omit" it, if TypeGraphQL supports that.
      },
      take: limit,
      orderBy: {
        start_at: 'asc',
      },
    });
  }

  @Query(() => [EventWithChapter])
  async paginatedEvents(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
  ): Promise<EventWithChapter[]> {
    return await prisma.events.findMany({
      include: {
        chapter: true,
        tags: { include: { tag: true } },
      },
      orderBy: {
        start_at: 'asc',
      },
      take: limit ?? 10,
      skip: offset,
    });
  }

  @Query(() => EventWithRelations, { nullable: true })
  async event(
    @Arg('id', () => Int) id: number,
  ): Promise<EventWithRelations | null> {
    return await prisma.events.findUnique({
      where: { id },
      include: {
        chapter: true,
        tags: { include: { tag: true } },
        venue: true,
        rsvps: {
          include: { user: true },
        },
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Mutation(() => Rsvp, { nullable: true })
  async rsvpEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<Rsvp | null> {
    if (!ctx.user) {
      throw new Error('You need to be logged in');
    }
    // TODO: can we stop including rsvps.events and rsvps.users?
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      include: {
        rsvps: {
          include: {
            user: {
              include: {
                user_event_roles: {
                  where: {
                    event_id: eventId,
                    subscribed: true,
                  },
                },
              },
            },
          },
        },
        user_event_roles: {
          include: { users: true },
          where: { role_name: 'organizer', subscribed: true },
        },
        venue: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const oldRsvp = await prisma.rsvps.findUnique({
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
      rejectOnNotFound: false,
    });

    if (oldRsvp) {
      await prisma.rsvps.delete({
        where: {
          user_id_event_id: {
            user_id: oldRsvp.user_id,
            event_id: oldRsvp.event_id,
          },
        },
      });
      await prisma.user_event_roles.delete({
        where: {
          user_id_event_id_role_name: {
            user_id: oldRsvp.user_id,
            event_id: oldRsvp.event_id,
            role_name: 'attendee',
          },
        },
      });

      if (!event.invite_only && !oldRsvp.on_waitlist) {
        const waitingList = event.rsvps.filter((r) => r.on_waitlist);

        if (waitingList.length) {
          const acceptedRsvp = waitingList[0];
          await prisma.rsvps.update({
            where: {
              user_id_event_id: {
                user_id: acceptedRsvp.user_id,
                event_id: acceptedRsvp.event_id,
              },
            },
            data: { on_waitlist: false },
          });

          const isSubscribed = acceptedRsvp.user.user_event_roles.length;

          if (isSubscribed) {
            await prisma.event_reminders.create({
              data: {
                user_id: acceptedRsvp.user_id,
                event_id: acceptedRsvp.event_id,
                remind_at: sub(event.start_at, { days: 1 }),
              },
            });
          }
        }
      }

      return null;
    }

    const going = event.rsvps.filter((r) => !r.on_waitlist);
    const waitlist = going.length >= event.capacity;

    const roleData: Prisma.user_event_rolesCreateInput = {
      subscribed: true, // TODO change to user specified value
      role_name: 'attendee',
      users: { connect: { id: ctx.user.id } },
      events: { connect: { id: eventId } },
    };

    const rsvpData: Prisma.rsvpsCreateInput = {
      events: { connect: { id: eventId } },
      user: { connect: { id: ctx.user.id } },
      date: new Date(),
      on_waitlist: event.invite_only ? true : waitlist,
      confirmed_at: event.invite_only ? null : new Date(),
      canceled: false,
    };

    const rsvp = await prisma.rsvps.create({ data: rsvpData });
    await prisma.user_event_roles.create({ data: roleData });
    if (!event.invite_only && !waitlist && roleData.subscribed) {
      await prisma.event_reminders.create({
        data: {
          user_id: ctx.user.id,
          event_id: eventId,
          remind_at: sub(event.start_at, { days: 1 }),
        },
      });
    }

    const linkDetails: CalendarEvent = {
      title: event.name,
      start: event.start_at,
      end: event.ends_at,
      description: event.description,
    };
    if (event.venue?.name) linkDetails.location = event.venue?.name;

    await new MailerService({
      emailList: [ctx.user.email],
      subject: `Invitation: ${event.name}`,
      htmlEmail: `Hi ${ctx.user.first_name},</br>
To add this event to your calendar(s) you can use these links:
</br>
<a href=${google(linkDetails)}>Google</a>
</br>
<a href=${outlook(linkDetails)}>Outlook</a>

${unsubscribe}
      `,
    }).sendEmail();

    const organizersEmails = event.user_event_roles.map(
      (role) => role.users.email,
    );
    await new MailerService({
      emailList: organizersEmails,
      subject: `New RSVP for ${event.name}`,
      htmlEmail: `User ${ctx.user.first_name} ${ctx.user.last_name} has RSVP'd. ${unsubscribe}`,
    }).sendEmail();
    return rsvp;
  }

  @Mutation(() => Rsvp)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<Rsvp> {
    if (!ctx.user) throw Error('User must be logged in to confirm RSVPs');
    const rsvp = await prisma.rsvps.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: { events: true },
    });

    const rsvpData: Prisma.rsvpsUpdateInput = {
      confirmed_at: new Date(),
      on_waitlist: false,
    };

    const subscribedRoles = await prisma.user_event_roles.findMany({
      where: {
        user_id: userId,
        event_id: eventId,
        subscribed: true,
      },
    });

    if (subscribedRoles.length) {
      await prisma.event_reminders.create({
        data: {
          user_id: userId,
          event_id: eventId,
          remind_at: sub(rsvp.events.start_at, { days: 1 }),
        },
      });
    }

    return await prisma.rsvps.update({
      data: rsvpData,
      where: {
        user_id_event_id: {
          user_id: rsvp.user_id,
          event_id: rsvp.event_id,
        },
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    await prisma.rsvps.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
    await prisma.user_event_roles.delete({
      where: {
        user_id_event_id_role_name: {
          user_id: userId,
          event_id: eventId,
          role_name: 'attendee',
        },
      },
    });

    return true;
  }

  @Mutation(() => Event)
  async createEvent(
    @Arg('data') data: CreateEventInputs,
    @Ctx() ctx: GQLCtx,
  ): Promise<Event | null> {
    if (!ctx.user) throw Error('User must be logged in to create events');
    let venue;
    if (data.venue_id) {
      venue = await prisma.venues.findUnique({ where: { id: data.venue_id } });
    }

    const chapter = await prisma.chapters.findUnique({
      where: { id: data.chapter_id },
    });

    // TODO: add admin and owner once you've figured out how to handle instance
    // roles
    const allowedRoles = ['organizer'] as const;
    const hasPermission =
      ctx.user.chapter_roles.findIndex(
        ({ chapter_id, role_name }) =>
          chapter_id === data.chapter_id &&
          allowedRoles.findIndex((x) => x === role_name) > -1,
      ) !== -1;

    if (!hasPermission)
      throw Error('User does not have permission to create events');

    const eventSponsorsData: Prisma.event_sponsorsCreateManyEventsInput[] =
      data.sponsor_ids.map((sponsor_id) => ({
        sponsor_id,
      }));
    const userEventRoleData: Prisma.user_event_rolesCreateWithoutEventsInput = {
      users: { connect: { id: ctx.user.id } },
      role_name: 'organizer',
      subscribed: true, // TODO: even organizers may wish to opt out of emails
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
      url: data.url,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      venue: isPhysical(data.venue_type) ? { connect: { id: venue?.id } } : {},
      chapter: { connect: { id: chapter.id } },
      sponsors: {
        createMany: { data: eventSponsorsData },
      },
      user_event_roles: {
        create: userEventRoleData,
      },
      tags: {
        create: getUniqueTags(data.tags).map((tagName) => ({
          tag: {
            connectOrCreate: {
              create: { name: tagName },
              where: { name: tagName },
            },
          },
        })),
      },
    };

    return await prisma.events.create({
      data: eventData,
      include: { tags: { include: { tag: true } } },
    });
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateEventInputs,
  ): Promise<Event | null> {
    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        venue: true,
        sponsors: true,
        rsvps: { include: { user: true } },
        event_reminders: true,
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

    await prisma.$transaction([
      prisma.events.update({
        where: { id },
        data: { tags: { deleteMany: {} } },
      }),
      prisma.events.update({
        where: { id },
        data: {
          tags: {
            create: getUniqueTags(data.tags).map((tagName) => ({
              tag: {
                connectOrCreate: {
                  create: { name: tagName },
                  where: { name: tagName },
                },
              },
            })),
          },
        },
      }),
    ]);

    const venueType = data.venue_type ?? event.venue_type;
    const eventOnline = isOnline(venueType);
    const eventPhysical = isPhysical(venueType);
    const venueData = {
      streaming_url: eventOnline
        ? data.streaming_url ?? event.streaming_url
        : null,
      venue: eventPhysical
        ? { connect: { id: data.venue_id } }
        : { disconnect: true },
    };

    // TODO: Handle tags
    const start_at = new Date(data.start_at) ?? event.start_at;
    const update: Prisma.eventsUpdateInput = {
      invite_only: data.invite_only ?? event.invite_only,
      name: data.name ?? event.name,
      description: data.description ?? event.description,
      url: data.url ?? event.url,
      start_at: start_at,
      ends_at: new Date(data.ends_at) ?? event.ends_at,
      capacity: data.capacity ?? event.capacity,
      image_url: data.image_url ?? event.image_url,
      venue_type: venueType,
      ...venueData,
    };

    if (!isEqual(start_at, event.start_at)) {
      event.event_reminders.forEach(async (reminder) => {
        await prisma.event_reminders.update({
          data: {
            remind_at: sub(start_at, { days: 1 }),
          },
          where: {
            user_id_event_id: {
              user_id: reminder.user_id,
              event_id: reminder.event_id,
            },
          },
        });
      });
    }

    const isVenueChanged =
      data.venue_type !== event.venue_type ||
      (eventOnline && data.streaming_url !== event.streaming_url) ||
      (eventPhysical && data.venue_id !== event.venue_id);

    if (isVenueChanged) {
      const emailList = event.rsvps.map((rsvp) => rsvp.user.email);
      const subject = `Venue changed for event ${event.name}`;
      let venueDetails = '';

      if (eventPhysical) {
        const venue = await prisma.venues.findUnique({
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

      if (eventOnline) {
        venueDetails += `Streaming URL: ${data.streaming_url}<br>`;
      }
      // TODO: include a link back to the venue page
      const body = `We have had to change the location of ${event.name}.<br>
${venueDetails}
${unsubscribe}`;
      new MailerService({
        emailList: emailList,
        subject: subject,
        htmlEmail: body,
      }).sendEmail();
    }

    return await prisma.events.update({
      where: { id },
      data: update,
      include: { tags: { include: { tag: true } } },
    });
  }

  @Mutation(() => Event)
  async cancelEvent(@Arg('id', () => Int) id: number): Promise<Event | null> {
    const event = await prisma.events.update({
      where: { id },
      data: { canceled: true },
      include: { tags: { include: { tag: true } } },
    });
    await prisma.event_reminders.deleteMany({
      where: {
        event_id: id,
      },
    });

    const notCancelledRsvps = await prisma.rsvps.findMany({
      where: {
        event_id: id,
        canceled: false,
      },
      include: { user: true },
    });

    if (notCancelledRsvps) {
      const emailList = notCancelledRsvps.map((rsvp) => rsvp.user.email);
      const subject = `Event ${event.name} cancelled`;
      const body = `placeholder body`;

      new MailerService({
        emailList: emailList,
        subject: subject,
        htmlEmail: body,
      }).sendEmail();
    }

    return event;
  }

  @Mutation(() => Event)
  async deleteEvent(@Arg('id', () => Int) id: number): Promise<Event> {
    return await prisma.events.delete({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
  }

  // TODO: This will need a real GraphQL return type (AFAIK you have to return
  // an object type)
  @Mutation(() => Boolean)
  async sendEventInvite(
    @Arg('id', () => Int) id: number,
    @Arg('emailGroups', () => [String], {
      nullable: true,
      defaultValue: ['interested'],
    })
    emailGroups: Array<'confirmed' | 'on_waitlist' | 'canceled' | 'interested'>,
  ): Promise<boolean> {
    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        venue: true,
        chapter: {
          include: {
            users: {
              include: {
                user: true,
              },
            },
          },
        },
        rsvps: {
          include: {
            user: true,
          },
        },
        user_event_roles: true,
      },
    });

    // TODO: the default should probably be to bcc everyone.
    const addresses: string[] = [];
    if (emailGroups.includes('interested')) {
      // TODO: event.chapters should be event.chapter and not be optional Once
      // that's fixed, we can make several chains non-optional (remove the ?s)
      const interestedUsers: string[] =
        event.chapter?.users
          ?.filter((role) => role.interested)
          .map(({ user }) => user.email) ?? [];

      addresses.push(...interestedUsers);
    }

    const subscribedUsers = event.user_event_roles
      .filter((role) => role.subscribed)
      .map((role) => role.user_id);
    if (emailGroups.includes('on_waitlist')) {
      const waitlistUsers: string[] = event.rsvps
        .filter(
          (rsvp) => rsvp.on_waitlist && subscribedUsers.includes(rsvp.user.id),
        )
        .map(({ user }) => user.email);
      addresses.push(...waitlistUsers);
    }
    if (emailGroups.includes('confirmed')) {
      const confirmedUsers: string[] = event.rsvps
        .filter(
          (rsvp) =>
            !rsvp.on_waitlist &&
            !rsvp.canceled &&
            subscribedUsers.includes(rsvp.user.id),
        )
        .map(({ user }) => user.email);
      addresses.push(...confirmedUsers);
    }
    if (emailGroups.includes('canceled')) {
      const confirmedUsers: string[] = event.rsvps
        .filter(
          (rsvp) => rsvp.canceled && subscribedUsers.includes(rsvp.user.id),
        )
        .map(({ user }) => user.email);
      addresses.push(...confirmedUsers);
    }

    if (!addresses.length) {
      return true;
    }
    const subject = `Invitation to ${event.name}.`;

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapter?.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}?emaillink=true`;
    const calendar = ical();
    calendar.createEvent({
      start: event.start_at,
      end: event.ends_at,
      summary: event.name,
      url: eventURL,
    });
    // TODO: it needs a link to unsubscribe from just this event.  See
    // https://github.com/freeCodeCamp/chapter/issues/276#issuecomment-596913322
    // Update the place holder with actual
    const body = `When: ${event.start_at} to ${event.ends_at}<br>
${event.venue ? `Where: ${event.venue.name}<br>` : ''}
${event.streaming_url ? `Streaming URL: ${event.streaming_url}<br>` : ''}
Event Details: <a href="${eventURL}">${eventURL}</a><br>
    <br>
    - Cancel your RSVP: <a href="${eventURL}">${eventURL}</a><br>
    - More about ${
      event.chapter?.name
    } or to unfollow this chapter: <a href="${chapterURL}">${chapterURL}</a><br>
    <br>
    ----------------------------<br>
    You received this email because you follow this chapter.<br>
    <br>
    See the options above to change your notifications.
    ${unsubscribe}
    `;

    await new MailerService({
      emailList: addresses,
      subject: subject,
      htmlEmail: body,
      iCalEvent: calendar.toString(),
    }).sendEmail();

    return true;
  }
}
