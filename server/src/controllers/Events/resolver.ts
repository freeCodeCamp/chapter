import { Prisma } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import {
  Event,
  EventUser,
  EventWithEverything,
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

@Resolver()
export class EventResolver {
  @Query(() => [EventWithEverything])
  async events(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('showAll', { nullable: true }) showAll?: boolean,
  ): Promise<EventWithEverything[]> {
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
                event_role_permissions: {
                  include: {
                    event_permission: true,
                  },
                },
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

  @Query(() => EventWithEverything, { nullable: true })
  async event(
    @Arg('id', () => Int) id: number,
  ): Promise<EventWithEverything | null> {
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
                event_role_permissions: {
                  include: {
                    event_permission: true,
                  },
                },
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
    // TODO: can we stop including rsvps.events and rsvps.users?
    const event = await prisma.events.findUnique({
      where: { id: eventId },
      include: {
        event_users: {
          include: { user: true, rsvp: true },
          where: {
            event_role: { name: 'organizer' },
            subscribed: true,
          },
        },
        venue: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const oldUserRole = await prisma.event_users.findUnique({
      include: {
        rsvp: true,
      },
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
      rejectOnNotFound: false,
    });

    if (oldUserRole) {
      await prisma.event_users.delete({
        where: {
          user_id_event_id: {
            user_id: oldUserRole.user_id,
            event_id: oldUserRole.event_id,
          },
        },
      });

      if (!event.invite_only && oldUserRole.rsvp.name !== 'waitlist') {
        const waitList = event.event_users.filter(
          ({ rsvp }) => rsvp.name === 'waitlist',
        );

        if (waitList.length) {
          await prisma.event_users.update({
            data: { rsvp: { connect: { name: 'yes' } } },
            where: {
              user_id_event_id: {
                user_id: waitList[0].user_id,
                event_id: waitList[0].event_id,
              },
            },
          });
        }
      }
      return null;
    }

    const going = event.event_users.filter(({ rsvp }) => rsvp.name === 'yes');
    const waitlist = going.length >= event.capacity;

    const eventUserData: Prisma.event_usersCreateInput = {
      user: { connect: { id: ctx.user.id } },
      event: { connect: { id: eventId } },
      rsvp: {
        connect: {
          name: event.invite_only || waitlist ? 'waitlist' : 'yes',
        },
      },
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
            event_role_permissions: {
              include: {
                event_permission: true,
              },
            },
          },
        },
      },
    });

    const linkDetails: CalendarEvent = {
      title: event.name,
      start: event.start_at,
      end: event.ends_at,
      description: event.description,
    };
    if (event.venue?.name) linkDetails.location = event.venue?.name;

    await new MailerService(
      [ctx.user.email],
      `Invitation: ${event.name}`,
      `Hi ${ctx.user.first_name},</br>
To add this event to your calendar(s) you can use these links:
</br>
<a href=${google(linkDetails)}>Google</a>
</br>
<a href=${outlook(linkDetails)}>Outlook</a>

${unsubscribe}
      `,
    ).sendEmail();

    const organizersEmails = event.event_users.map(({ user }) => user.email);
    await new MailerService(
      organizersEmails,
      `New RSVP for ${event.name}`,
      `User ${ctx.user.first_name} ${ctx.user.last_name} has RSVP'd. ${unsubscribe}`,
    ).sendEmail();
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

    const eventUserOrganizer: Prisma.event_usersCreateWithoutEventInput = {
      user: { connect: { id: ctx.user.id } },
      event_role: {
        connect: {
          name: 'organizer',
        },
      },
      rsvp: {
        connect: {
          name: 'yes',
        },
      },
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
      streaming_url: data.streaming_url,
      venue_type: data.venue_type,
      url: data.url,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      venue: { connect: { id: venue?.id } },
      chapter: { connect: { id: chapter.id } },
      sponsors: {
        createMany: { data: eventSponsorsData },
      },
      event_users: {
        create: eventUserOrganizer,
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
          include: { user: true },
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

    // TODO: Handle tags
    const update: Prisma.eventsUpdateInput = {
      invite_only: data.invite_only ?? event.invite_only,
      name: data.name ?? event.name,
      description: data.description ?? event.description,
      url: data.url ?? event.url,
      streaming_url: data.streaming_url ?? event.streaming_url,
      venue_type: data.venue_type ?? event.venue_type,
      start_at: new Date(data.start_at) ?? event.start_at,
      ends_at: new Date(data.ends_at) ?? event.ends_at,
      capacity: data.capacity ?? event.capacity,
      image_url: data.image_url ?? event.image_url,
      venue: { connect: { id: data.venue_id } },
    };

    if (data.venue_id) {
      const venue = await prisma.venues.findUnique({
        where: { id: data.venue_id },
      });
      // TODO: include a link back to the venue page
      if (event.venue_id !== venue.id) {
        const emailList = event.event_users.map(({ user }) => user.email);
        const subject = `Venue changed for event ${event.name}`;
        const body = `We have had to change the location of ${event.name}.
The event is now being held at <br>
${venue.name} <br>
${venue.street_address ? venue.street_address + '<br>' : ''}
${venue.city} <br>
${venue.region} <br>
${venue.postal_code} <br>
${unsubscribe}
`;
        new MailerService(emailList, subject, body).sendEmail();
      }
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
            rsvp: {
              name: {
                not: 'no',
              },
            },
          },
        },
      },
    });

    const notCancelledRsvps = event.event_users;

    if (notCancelledRsvps.length) {
      const emailList = notCancelledRsvps.map(({ user }) => user.email);
      const subject = `Event ${event.name} cancelled`;
      const body = `placeholder body`;

      new MailerService(emailList, subject, body).sendEmail();
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
        event_users: {
          include: {
            rsvp: true,
            user: true,
          },
          where: {
            subscribed: true,
          },
        },
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

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapter?.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}?emaillink=true`;
    // TODO: this needs to include an ical file
    // TODO: it needs a link to unsubscribe from just this event.  See
    // https://github.com/freeCodeCamp/chapter/issues/276#issuecomment-596913322
    // Update the place holder with actual
    const body =
      `When: ${event.start_at} to ${event.ends_at}<br>` +
      (event.venue ? `Where: ${event.venue?.name}<br>` : '') +
      `Event Details: <a href="${eventURL}">${eventURL}</a><br>
    <br>
    - Cancel your RSVP: <a href="${eventURL}">${eventURL}</a><br>
    - More about ${event.chapter?.name} or to unfollow this chapter: <a href="${chapterURL}">${chapterURL}</a><br>
    <br>
    ----------------------------<br>
    You received this email because you follow this chapter.<br>
    <br>
    See the options above to change your notifications.
    ${unsubscribe}
    `;

    await new MailerService(addresses, subject, body).sendEmail();

    return true;
  }
}
