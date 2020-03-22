import { Request, Response } from 'express';
import { Event } from 'server/models/Event';
import { PostgresErrorCodes } from 'server/util/PostgresErrorConstants';
import { Tag } from 'server/models/Tag';
import sanitizeTags from 'server/util/sanitizeTags';
import { Venue } from 'server/models';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async index(req: Request, res: Response) {
    const { chapterId } = req.params;

    const events = await Event.find({
      where: { chapter: chapterId },
      relations: ['tags'],
    });

    res.json(events);
  },

  async show(req: Request, res: Response) {
    const { id, chapterId } = req.params;

    const event = await Event.findOne({
      where: {
        id: parseInt(id),
        chapter: chapterId,
      },
      loadRelationIds: { relations: ['venue'] },
      relations: ['tags'],
    });

    if (event) {
      res.json({ ...event, venue_id: event.venue.id });
    } else {
      res.status(404).json({ error: "Can't find event" });
    }
  },

  async create(req: Request, res: Response) {
    const {
      name,
      chapter,
      description,
      capacity,
      venue,
      start_at,
      ends_at,
      tags,
    } = req.body;

    const event = new Event({
      name,
      chapter,
      description,
      capacity,
      venue,
      start_at,
      ends_at,
    });

    try {
      await event.save();

      const sanitizedTags = Array.from(new Set(sanitizeTags(tags)));
      const outTags = await Promise.all(
        sanitizedTags.map(item => {
          const tag = new Tag({ name: item, event });
          return tag.save();
        }),
      );

      return res.status(201).json({
        event,
        tags: outTags.map((tag: Tag) => ({ id: tag.id, name: tag.name })),
      });
    } catch (e) {
      if (e.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
        if (e.detail.includes('venue')) {
          return res
            .status(400)
            .json({ error: { message: 'venue not found' } });
        }
        if (e.detail.includes('chapter')) {
          return res
            .status(400)
            .json({ error: { message: 'chapter not found' } });
        }
      }

      res.status(500).json({ error: e });
    }
  },

  async update(req: Request, res: Response) {
    const { id, chapterId } = req.params;
    const {
      name,
      description,
      capacity,
      venue,
      canceled,
      start_at,
      ends_at,
    } = req.body;

    const tags = req.body.tags as
      | { add: string[]; remove: number[] }
      | undefined;

    const event = await Event.findOne({
      where: { id: parseInt(id), chapter: chapterId },
      loadRelationIds: { relations: ['venue'] },
      relations: tags ? ['tags'] : [],
    });

    if (event) {
      event.name = name ?? event.name;
      event.description = description ?? event.description;
      event.capacity = capacity ?? event.capacity;
      if (venue && event.venue.id !== venue) {
        const newVenue = await Venue.findOne({ id: venue });
        if (newVenue) {
          event.venue = newVenue;
        }
      }
      event.canceled = canceled ?? event.canceled;
      event.start_at = start_at ?? event.start_at;
      event.ends_at = ends_at ?? event.ends_at;

      if (tags) {
        console.log(tags);
      }

      try {
        await event.save();
        res.json(event);
      } catch (e) {
        if (e.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
          if (e.detail.includes('venue')) {
            return res.status(400).json({ message: 'venue not found' });
          }
          if (e.detail.includes('chapter')) {
            return res.status(400).json({ message: 'chapter not found' });
          }
        }

        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find event" });
    }
  },
  async remove(req: Request, res: Response) {
    const { id, chapterId } = req.params;

    const event = await Event.findOne({
      where: { id: parseInt(id), chapter: chapterId },
    });

    if (event) {
      try {
        await event.remove();
        res.json({ id: parseInt(id) });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find event" });
    }
  },
  async cancel(req: Request, res: Response) {
    const { id, chapterId } = req.params;

    const event = await Event.findOne({
      where: { id: parseInt(id), chapter: chapterId },
    });

    if (event) {
      event.canceled = true;

      try {
        await event.save();
        res.json(event);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find event" });
    }
  },
};
