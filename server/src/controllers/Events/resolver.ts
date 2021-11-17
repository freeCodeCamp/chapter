import { Prisma } from '@prisma/client';
import { CalendarEvent, google, outlook } from 'calendar-link';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';
import { MoreThan } from 'typeorm';
import { CreateEventInputs, UpdateEventInputs } from './inputs';
import { GQLCtx } from 'src/common-types/gql';
import {
  Event,
  Venue,
  Chapter,
  Rsvp,
  UserEventRole,
  EventSponsor,
} from 'src/models';
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
    // Since we're saving rsvps, we have to get the rsvps.event and rsvps.user
    // relations.
    const event = await Event.findOne(eventId, {
      relations: [
        'rsvps',
        'rsvps.event',
        'rsvps.user',
        'user_roles',
        'user_roles.user',
      ],
    });
    if (!event) {
      throw new Error('Event not found');
    }

    // We need to loadRelationIds so that rsvp.remove() knows which record to
    // delete. disableMixedMap stops typeorm mapping flattening the object. i.e.
    // we want { event: { id: n } }, not { event: n}
    let rsvp = await Rsvp.findOne({
      where: { event: { id: eventId }, user: { id: ctx.user.id } },
      loadRelationIds: { disableMixedMap: true },
    });

    if (rsvp) {
      await rsvp.remove();

      if (!rsvp.on_waitlist) {
        const waitingList = event.rsvps.filter((r) => r.on_waitlist);

        if (waitingList.length > 0) {
          waitingList[0].on_waitlist = false;
          await waitingList[0].save();
        }
      }

      return null;
    }

    const going = event.rsvps.filter((r) => !r.on_waitlist);
    const waitlist = going.length >= event.capacity;

    rsvp = new Rsvp({
      event,
      user: ctx.user,
      date: new Date(),
      on_waitlist: event.invite_only ? true : waitlist,
      confirmed_at: event.invite_only ? null : new Date(),
    });

    await rsvp.save();
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
    // TODO: rather than getting all the roles and filtering them, we should
    // create a query to get only the relevant roles
    const organizersEmails = event.user_roles
      .filter((role) => role.role_name == 'organizer')
      .map((role) => role.user.email);
    await new MailerService(
      organizersEmails,
      `New RSVP for ${event.name}`,
      `User ${ctx.user.first_name} ${ctx.user.last_name} has RSVP'd. ${unsubscribe}`,
    ).sendEmail();
    return rsvp;
  }

  @Mutation(() => Rsvp)
  async confirmRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<Rsvp> {
    if (!ctx.user) throw Error('User must be logged in to confirm RSVPs');
    const rsvp = await Rsvp.findOne({
      where: { event_id: eventId, user_id: userId },
      relations: ['event'],
    });
    if (!rsvp) {
      throw new Error('RSVP not found');
    }

    rsvp.confirmed_at = new Date();
    rsvp.on_waitlist = false;

    await rsvp.save();

    return rsvp;
  }

  @Mutation(() => Boolean)
  async deleteRsvp(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<boolean> {
    const rsvp = await Rsvp.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (!rsvp) {
      throw new Error('RSVP not found');
    }

    await rsvp.remove();

    return true;
  }

  @Mutation(() => Event)
  async createEvent(@Arg('data') data: CreateEventInputs, @Ctx() ctx: GQLCtx) {
    if (!ctx.user) throw Error('User must be logged in to create events');
    let venue;
    if (data.venueId) {
      venue = await Venue.findOne(data.venueId);
      if (!venue) throw new Error('Venue missing');
    }

    const chapter = await Chapter.findOne(data.chapterId);
    if (!chapter) throw new Error('Chapter missing');

    // TODO: add admin and owner once you've figured out how to handle instance
    // roles
    const allowedRoles = ['organizer'] as const;
    const hasPermission =
      ctx.user.chapter_roles.findIndex(
        ({ chapter_id, role_name }) =>
          chapter_id === data.chapterId &&
          allowedRoles.findIndex((x) => x === role_name) > -1,
      ) !== -1;

    if (!hasPermission)
      throw Error('User does not have permission to create events');

    const event = await new Event({
      ...data,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      venue,
      chapter,
      user_roles: [],
      sponsors: [],
    }).save();

    event.sponsors = await Promise.all(
      data.sponsorIds.map((s) =>
        new EventSponsor({
          eventId: event.id,
          sponsorId: s,
        }).save(),
      ),
    );

    event.user_roles = [
      await new UserEventRole({
        userId: ctx.user.id,
        eventId: event.id,
        roleName: 'organizer',
        subscribed: true, // TODO: even organizers may wish to opt out of emails
      }).save(),
    ];

    return event;
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
      data.sponsorIds.map((sId) => ({
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
      venues: { connect: { id: data.venueId } },
    };

    if (data.venueId) {
      const venue = await prisma.venues.findUnique({
        where: { id: data.venueId },
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
    const event = await Event.findOne(id);
    if (!event) throw new Error('Cant find event');

    event.canceled = true;

    return event.save();
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg('id', () => Int) id: number) {
    const event = await Event.findOne(id);

    if (!event) throw new Error('Cant find event');

    await event.remove();

    return true;
  }

  @Mutation(() => Boolean)
  async sendEventInvite(
    @Arg('id', () => Int) id: number,
    @Arg('emailGroups', () => [String], {
      nullable: true,
      defaultValue: ['interested'],
    })
    emailGroups: Array<'confirmed' | 'on_waitlist' | 'canceled' | 'interested'>,
  ) {
    const event = await Event.findOne(id, {
      relations: [
        'venue',
        'chapter',
        'chapter.users',
        'chapter.users.user',
        'rsvps',
        'rsvps.user',
        'user_roles',
      ],
    });

    if (!event) throw new Error("Can't find event");

    // TODO: the default should probably be to bcc everyone.
    const addresses: string[] = [];
    if (emailGroups.includes('interested')) {
      const interestedUsers: string[] = event.chapter.users
        .filter((role) => role.interested)
        .map(({ user }) => user.email);

      addresses.push(...interestedUsers);
    }

    const subscribedUsers = event.user_roles
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

    const chapterURL = `${process.env.CLIENT_LOCATION}/chapters/${event.chapter.id}`;
    const eventURL = `${process.env.CLIENT_LOCATION}/events/${event.id}`;
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
- More about ${event.chapter.name} or to unfollow this chapter: <a href="${chapterURL}">${chapterURL}</a><br>
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
