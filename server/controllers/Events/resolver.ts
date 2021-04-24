import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Event, Venue, Chapter } from '../../models';
import { CreateEventInputs, UpdateEventInputs } from './inputs';
import { MoreThan } from 'typeorm';

@Resolver()
export class EventResolver {
  @Query(() => [Event])
  events(
    @Arg('limit', { nullable: true }) limit?: number,
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

  @Query(() => Event, { nullable: true })
  event(@Arg('id', () => Int) id: number) {
    return Event.findOne(id, {
      relations: ['chapter', 'tags', 'venue', 'rsvps', 'rsvps.user'],
    });
  }

  @Mutation(() => Event)
  async createEvent(@Arg('data') data: CreateEventInputs) {
    let venue;
    if (data.venueId) {
      venue = await Venue.findOne(data.venueId);
      if (!venue) throw new Error('Venue missing');
    }

    const chapter = await Chapter.findOne(data.chapterId);
    if (!chapter) throw new Error('Chapter missing');

    const event = new Event({
      ...data,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      venue,
      chapter,
    });

    return event.save();
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateEventInputs,
  ) {
    const event = await Event.findOne(id);
    if (!event) throw new Error('Cant find event');

    // TODO: Handle tags
    event.tags = [];

    event.name = data.name ?? event.name;
    event.description = data.description ?? event.description;
    event.url = data.url ?? event.url;
    event.video_url = data.video_url ?? event.video_url;
    event.venue_type = data.venue_type ?? event.venue_type;
    event.start_at = new Date(data.start_at) ?? event.start_at;
    event.ends_at = new Date(data.ends_at) ?? event.ends_at;
    event.capacity = data.capacity ?? event.capacity;

    if (data.venueId) {
      const venue = await Venue.findOne(data.venueId);
      if (!venue) throw new Error('Cant find venue');
      event.venue = venue;
    }
    return event.save();
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
}
