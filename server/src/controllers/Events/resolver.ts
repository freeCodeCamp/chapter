import {
  events,
  events_venue_type_enum,
  event_roles,
  event_users,
  Prisma,
  rsvp,
  users,
  venues,
} from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';

import { isEqual, sub } from 'date-fns';
import ical from 'ical-generator';

import { GQLCtx } from '../../common-types/gql';
import {
  Event,
  EventUser,
  EventWithRelations,
  EventWithChapter,
  User,
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

const sendRsvpInvitation = async (
  user: User,
  event: events & { venue: venues | null },
) => {
  const linkDetails: CalendarEvent = {
    title: event.name,
    start: event.start_at,
    end: event.ends_at,
    description: event.description,
  };
  if (event.venue?.name) linkDetails.location = event.venue?.name;

  await new MailerService({
    emailList: [user.email],
    subject: `Invitation: ${event.name}`,
    htmlEmail: `Hi ${user.first_name},</br>
To add this event to your calendar(s) you can use these links:
</br>
<a href=${google(linkDetails)}>Google</a>
</br>
<a href=${outlook(linkDetails)}>Outlook</a>

${unsubscribe}
      `,
  }).sendEmail();
};

type RsvpNotificationEvent = events & {
  event_users: { event_role: event_roles; user: users }[];
};
const rsvpNotifyOrganizer = async (
  user: User,
  event: RsvpNotificationEvent,
) => {
  const organizersEmails = event.event_users
    .filter(({ event_role }) => event_role.name === 'organizer')
    .map(({ user }) => user.email);
  await new MailerService({
    emailList: organizersEmails,
    subject: `New RSVP for ${event.name}`,
    htmlEmail: `User ${user.first_name} ${user.last_name} has RSVP'd. ${unsubscribe}`,
  }).sendEmail();
};

type EventRsvpName = events & { event_users: (event_users & { rsvp: rsvp })[] };
const getRsvpName = (event: EventRsvpName) => {
  const going = event.event_users.filter(({ rsvp }) => rsvp.name === 'yes');
  const waitlist = going.length >= event.capacity;
  return event.invite_only || waitlist ? 'waitlist' : 'yes';
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
        tags: { include: { tag: true } },
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
        sponsors: { include: { sponsor: true } },
      },
    });
  }

  @Mutation(() => EventUser, { nullable: true })
  async rsvpEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser | null> {
    if (!ctx.user) {
      throw new Error('You need to be logged in');
    }
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      include: {
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
        venue: true,
      },
    });

    const oldUserRole = await prisma.event_users.findUnique({
      include: { rsvp: true },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
      rejectOnNotFound: false,
    });

    if (oldUserRole) {
      let updateData: Prisma.event_usersUpdateInput;
      if (['yes', 'waitlist'].includes(oldUserRole.rsvp.name)) {
        updateData = {
          rsvp: { connect: { name: 'no' } },
        };
        if (!event.invite_only && oldUserRole.rsvp.name !== 'waitlist') {
          const waitList = event.event_users.filter(
            ({ rsvp, user_id }) =>
              user_id !== oldUserRole.user_id && rsvp.name === 'waitlist',
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
              await prisma.event_reminders.create({
                data: {
                  event_user: {
                    connect: {
                      user_id_event_id: {
                        event_id: acceptedRsvp.event_id,
                        user_id: acceptedRsvp.user_id,
                      },
                    },
                  },
                  remind_at: sub(event.start_at, { days: 1 }),
                },
              });
            }
          }
        }
      } else {
        updateData = {
          rsvp: { connect: { name: getRsvpName(event) } },
        };

        await sendRsvpInvitation(ctx.user, event);
        await rsvpNotifyOrganizer(ctx.user, event);
      }
      return await prisma.event_users.update({
        data: updateData,
        include: {
          rsvp: true,
          user: true,
          event_role: {
            include: {
              event_role_permissions: { include: { event_permission: true } },
            },
          },
        },
        where: {
          user_id_event_id: {
            user_id: ctx.user.id,
            event_id: eventId,
          },
        },
      });
    }

    const rsvpName = getRsvpName(event);
    const eventUserData: Prisma.event_usersCreateInput = {
      user: { connect: { id: ctx.user.id } },
      event: { connect: { id: eventId } },
      rsvp: { connect: { name: rsvpName } },
      event_role: { connect: { name: 'attendee' } },
      subscribed: true, // TODO use user specified setting
    };

    const userRole = await prisma.event_users.create({
      data: eventUserData,
      include: {
        rsvp: true,
        user: true,
        event_role: {
          include: {
            event_role_permissions: { include: { event_permission: true } },
          },
        },
      },
    });
    if (rsvpName !== 'waitlist' && eventUserData.subscribed) {
      await prisma.event_reminders.create({
        data: {
          event_user: {
            connect: {
              user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
            },
          },
          remind_at: sub(event.start_at, { days: 1 }),
        },
      });
    }

    await sendRsvpInvitation(ctx.user, event);
    await rsvpNotifyOrganizer(ctx.user, event);
    return userRole;
  }

  @Mutation(() => EventUser)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser> {
    if (!ctx.user) throw Error('User must be logged in to confirm RSVPs');
    const eventUser = await prisma.event_users.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      include: { event: true },
    });

    return await prisma.event_users.update({
      data: { rsvp: { connect: { name: 'yes' } } },
      where: {
        user_id_event_id: {
          user_id: eventUser.user_id,
          event_id: eventUser.event_id,
        },
      },
      include: {
        rsvp: true,
        event_role: {
          include: {
            event_role_permissions: {
              include: {
                event_permission: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    await prisma.event_users.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
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
      ctx.user.user_chapters.findIndex(
        ({ chapter_id, chapter_role }) =>
          chapter_id === data.chapter_id &&
          allowedRoles.findIndex((x) => x === chapter_role.name) > -1,
      ) !== -1;

    if (!hasPermission)
      throw Error('User does not have permission to create events');

    const eventSponsorsData: Prisma.event_sponsorsCreateManyEventsInput[] =
      data.sponsor_ids.map((sponsor_id) => ({
        sponsor_id,
      }));

    const eventUserData: Prisma.event_usersCreateWithoutEventInput = {
      user: { connect: { id: ctx.user.id } },
      event_role: { connect: { name: 'organizer' } },
      rsvp: { connect: { name: 'yes' } },
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
      event_users: {
        create: eventUserData,
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

    // This is asychronous, but we don't use the result, so we don't wait for it
    if (!isEqual(start_at, event.start_at)) {
      event.event_users.forEach(({ event_reminder }) => {
        if (event_reminder) {
          prisma.event_reminders.update({
            data: {
              remind_at: sub(start_at, { days: 1 }),
            },
            where: {
              user_id_event_id: {
                user_id: event_reminder.user_id,
                event_id: event_reminder.event_id,
              },
            },
          });
        }
      });
    }

    const isVenueChanged =
      data.venue_type !== event.venue_type ||
      (eventOnline && data.streaming_url !== event.streaming_url) ||
      (eventPhysical && data.venue_id !== event.venue_id);

    if (isVenueChanged) {
      const emailList = event.event_users.map(({ user }) => user.email);
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
      include: {
        tags: { include: { tag: true } },
        event_users: {
          include: { user: true },
          where: {
            subscribed: true,
            rsvp: { name: { not: 'no' } },
          },
        },
      },
    });
    await prisma.event_reminders.deleteMany({
      where: {
        event_id: id,
      },
    });

    const notCanceledRsvps = event.event_users;

    if (notCanceledRsvps.length) {
      const emailList = notCanceledRsvps.map(({ user }) => user.email);
      const subject = `Event ${event.name} canceled`;
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
        chapter: { include: { chapter_users: { include: { user: true } } } },
        event_users: {
          include: { rsvp: true, user: true },
          where: { subscribed: true },
        },
      },
    });

    // TODO: the default should probably be to bcc everyone.
    const addresses: string[] = [];
    if (emailGroups.includes('interested')) {
      const interestedUsers: string[] =
        event.chapter.chapter_users
          ?.filter((user) => user.subscribed)
          .map(({ user }) => user.email) ?? [];

      addresses.push(...interestedUsers);
    }

    if (emailGroups.includes('on_waitlist')) {
      const waitlistUsers: string[] = event.event_users
        .filter(({ rsvp }) => rsvp.name === 'waitlist')
        .map(({ user }) => user.email);
      addresses.push(...waitlistUsers);
    }
    if (emailGroups.includes('confirmed')) {
      const confirmedUsers: string[] = event.event_users
        .filter(({ rsvp }) => rsvp.name === 'yes')
        .map(({ user }) => user.email);
      addresses.push(...confirmedUsers);
    }
    if (emailGroups.includes('canceled')) {
      const canceledUsers: string[] = event.event_users
        .filter(({ rsvp }) => rsvp.name === 'no')
        .map(({ user }) => user.email);
      addresses.push(...canceledUsers);
    }

    if (!addresses.length) {
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
      event.chapter.name
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
