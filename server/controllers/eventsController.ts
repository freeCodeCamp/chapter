import { Request, Response } from 'express';
import { Event } from 'server/models/Event';
import { PostgresErrorCodes } from 'server/util/PostgresErrorConstants';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async index(req: Request, res: Response) {
    const { chapterId } = req.params;

    const events = await Event.find({ where: { chapter: chapterId } });

    res.json(events);
  },

  async show(req: Request, res: Response) {
    const { id, chapterId } = req.params;

    const event = await Event.findOne({
      where: {
        id: parseInt(id),
        chapter: chapterId,
      },
    });

    if (event) {
      res.json(event);
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
      canceled,
      start_at,
      ends_at,
    } = req.body;

    const event = new Event({
      name,
      chapter,
      description,
      capacity,
      venue,
      canceled,
      start_at,
      ends_at,
    });

    try {
      await event.save();
      res.status(201).json(event);
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

    const event = await Event.findOne({
      where: { id: parseInt(id), chapter: chapterId },
    });

    if (event) {
      event.name = name ?? event.name;
      event.description = description ?? event.description;
      event.capacity = capacity ?? event.capacity;
      event.venue = venue ?? event.venue;
      event.canceled = canceled ?? event.canceled;
      event.start_at = start_at ?? event.start_at;
      event.ends_at = ends_at ?? event.ends_at;

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
        res.json({ id });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find event" });
    }
  },
};
