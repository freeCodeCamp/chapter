import { Prisma } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';
import { MoreThan } from 'typeorm';
import { CreateEventInputs, UpdateEventInputs } from './inputs';
import { GQLCtx } from 'src/common-types/gql';
import { Event, Rsvp } from 'src/models';
import { prisma } from 'src/prisma';
import MailerService from 'src/services/MailerService';

//Place holder for unsubscribe
//TODO: Replace placeholder with actual unsubscribe link
const unsubscribe = `<br/> <a href='https://www.freecodecamp.org/'> Unsubscribe</a>`;

@Resolver()
export class EventResolver {
  @Query(() => [Event])
  events(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('showAll', { nullable: true }) showAll?: boolean,
  ) {
    return Event.find({
      relations: ['chapter', 'tags', 'venue', 'rsvps', 'rsvps.user'],
      take: limit,
      order: {
        start_at: 'ASC',
      },
      where: {
        ...(!showAll && { start_at: MoreThan(new Date()) }),
      },
    });
  }

  @Query(() => [Event])
  async paginatedEvents(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
  ): Promise<Event[]> {
    return await Event.find({
      relations: ['chapter', 'tags', 'venue', 'rsvps', 'rsvps.user'],
      order: {
        start_at: 'ASC',
      },
      take: limit || 10,
      skip: offset,
    });
  }

  @Query(() => Event, { nullable: true })
  event(@Arg('id', () => Int) id: number) {
    // TODO: since the query expects to see { chapter } not { chapters }, this
    // won't work. It will have to wait until we rename chapters in the schema.

    // const event = await prisma.events.findUnique({
    //   where: { id },
    //   include: {
    //     chapters: true,
    //     tags: true,
    //     venues: true,
    //     rsvps: {
    //       include: { users: true },
    //     },
    //     user_event_roles: true,
    //     event_sponsors: { include: { sponsors: true } },
    //   },
    // });

    return Event.findOne(id, {
      relations: [
        'chapter',
        'tags',
        'venue',
        'rsvps',
        'rsvps.user',
        'user_roles',
        'sponsors',
        'sponsors.sponsor',
      ],
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
        rsvps: true,
        user_event_roles: { include: { users: true } },
        venues: true,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const rsvp = await prisma.rsvps.findUnique({
      where: {
        user_id_event_id: {
          user_id: ctx.user.id,
          event_id: eventId,
        },
      },
    });

    if (rsvp) {
      await prisma.rsvps.delete({
        where: {
          user_id_event_id: {
            user_id: rsvp.user_id,
            event_id: rsvp.event_id,
          },
        },
      });

      if (!rsvp.on_waitlist) {
        const waitingList = event.rsvps.filter((r) => r.on_waitlist);

        if (waitingList.length > 0) {
          await prisma.rsvps.update({
            where: {
              user_id_event_id: {
                user_id: waitingList[0].user_id,
                event_id: waitingList[0].event_id,
              },
            },
            data: { on_waitlist: false },
          });
        }
      }

      return null;
    }

    const going = event.rsvps.filter((r) => !r.on_waitlist);
    const waitlist = going.length >= event.capacity;

    const rsvpData: Prisma.rsvpsCreateInput = {
      events: { connect: { id: eventId } },
      users: { connect: { id: ctx.user.id } },
      date: new Date(),
      on_waitlist: event.invite_only ? true : waitlist,
      confirmed_at: event.invite_only ? null : new Date(),
      canceled: false,
    };

    await prisma.rsvps.create({ data: rsvpData });

    const linkDetails: CalendarEvent = {
      title: event.name,
      start: event.start_at,
      end: event.ends_at,
      description: event.description,
    };
    if (event.venues?.name) linkDetails.location = event.venues?.name;

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
    // TODO: rather than getting all the roles and filtering them, we should
    // create a query to get only the relevant roles
    const organizersEmails = event.user_event_roles
      .filter((role) => role.role_name == 'organizer')
      .map((role) => role.users.email);
    await new MailerService(
      organizersEmails,
      `New RSVP for ${event.name}`,
      `User ${ctx.user.first_name} ${ctx.user.last_name} has RSVP'd. ${unsubscribe}`,
    ).sendEmail();
    return rsvp;
  }

  // TODO: add a return type once the TypeORM decorators have been removed
  @Mutation(() => Rsvp)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ) {
    if (!ctx.user) throw Error('User must be logged in to confirm RSVPs');
    const rsvp = await prisma.rsvps.findUnique({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });

    // TODO: tell TS that rsvp exists more directly
    if (!rsvp) {
      throw new Error('RSVP not found');
    }

    const rsvpData: Prisma.rsvpsUpdateInput = {
      confirmed_at: new Date(),
      on_waitlist: false,
    };

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

    return true;
  }

  @Mutation(() => Event)
  async createEvent(@Arg('data') data: CreateEventInputs, @Ctx() ctx: GQLCtx) {
    if (!ctx.user) throw Error('User must be logged in to create events');
    let venue;
    if (data.venue_id) {
      venue = await prisma.venues.findUnique({ where: { id: data.venue_id } });
      if (!venue) throw new Error('Venue missing');
    }

    const chapter = await prisma.chapters.findUnique({
      where: { id: data.chapter_id },
    });
    if (!chapter) throw new Error('Chapter missing');

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
      venues: { connect: { id: venue?.id } },
      chapters: { connect: { id: chapter.id } },
    };

    const event = await prisma.events.create({ data: eventData });

    const eventSponsorsData: Prisma.event_sponsorsCreateManyInput[] =
      data.sponsor_ids.map((sponsor_id) => ({
        event_id: event.id,
        sponsor_id,
      }));

    await prisma.event_sponsors.createMany({ data: eventSponsorsData });

    const userEventRoleData: Prisma.user_event_rolesCreateManyInput = {
      user_id: ctx.user.id,
      event_id: event.id,
      role_name: 'organizer',
      subscribed: true, // TODO: even organizers may wish to opt out of emails
    };

    await prisma.user_event_roles.create({ data: userEventRoleData });

    // TODO: create the event with a single create call - then we will not have to
    // do yet another query to get the completed event
    const fullEvent = await prisma.events.findUnique({
      where: { id: event.id },
    });

    return fullEvent;
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateEventInputs,
  ) {
    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        venues: true,
        event_sponsors: true,
        rsvps: { include: { users: true } },
      },
    });
    if (!event) throw new Error('Cant find event');

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
      venues: { connect: { id: data.venue_id } },
    };

    if (data.venue_id) {
      const venue = await prisma.venues.findUnique({
        where: { id: data.venue_id },
      });
      if (!venue) throw new Error('Cant find venue');
      // TODO: include a link back to the venue page
      if (event.venue_id !== venue.id) {
        const emailList = event.rsvps.map((rsvp) => rsvp.users.email);
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

    return await prisma.events.update({ where: { id }, data: update });
  }

  @Mutation(() => Event)
  async cancelEvent(@Arg('id', () => Int) id: number) {
    const event = await prisma.events.update({
      where: { id },
      data: { canceled: true },
    });

    return event;
  }

  // TODO: This will need a real GraphQL return type (AFAIK you have to return
  // an object type)
  @Mutation(() => Boolean)
  async deleteEvent(@Arg('id', () => Int) id: number) {
    await prisma.events.delete({ where: { id } });
    return true;
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
  ) {
    const event = await prisma.events.findUnique({
      where: { id },
      include: {
        venues: true,
        chapters: {
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
            users: true,
          },
        },
        user_event_roles: true,
      },
    });

    // TODO: if we've got here, the event exists, since findUnique throws if it
    // fails to find something (find a better way to convince TypesScript of
    // this)
    if (!event) throw new Error("Can't find event");

    // TODO: the default should probably be to bcc everyone.
    const addresses: string[] = [];
    if (emailGroups.includes('interested')) {
      // TODO: event.chapters should be event.chapter and not be optional Once
      // that's fixed, we can make several chains non-optional (remove the ?s)
      const interestedUsers: string[] =
        event.chapters?.users
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
          (rsvp) => rsvp.on_waitlist && subscribedUsers.includes(rsvp.users.id),
        )
        .map(({ users }) => users.email);
      addresses.push(...waitlistUsers);
    }
    if (emailGroups.includes('confirmed')) {
      const confirmedUsers: string[] = event.rsvps
        .filter(
          (rsvp) =>
            !rsvp.on_waitlist &&
            !rsvp.canceled &&
            subscribedUsers.includes(rsvp.users.id),
        )
        .map(({ users }) => users.email);
      addresses.push(...confirmedUsers);
    }
    if (emailGroups.includes('canceled')) {
      const confirmedUsers: string[] = event.rsvps
        .filter(
          (rsvp) => rsvp.canceled && subscribedUsers.includes(rsvp.users.id),
        )
        .map(({ users }) => users.email);
      addresses.push(...confirmedUsers);
    }

    if (!addresses.length) {
      return true;
    }
    const subject = `Invitation to ${event.name}.`;

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapters?.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}`;
    // TODO: this needs to include an ical file
    // TODO: it needs a link to unsubscribe from just this event.  See
    // https://github.com/freeCodeCamp/chapter/issues/276#issuecomment-596913322
    // Update the place holder with actual
    const body =
      `When: ${event.start_at} to ${event.ends_at}<br>` +
      (event.venues ? `Where: ${event.venues?.name}<br>` : '') +
      `Event Details: <a href="${eventURL}">${eventURL}</a><br>
    <br>
    - Cancel your RSVP: <a href="${eventURL}">${eventURL}</a><br>
    - More about ${event.chapters?.name} or to unfollow this chapter: <a href="${chapterURL}">${chapterURL}</a><br>
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
