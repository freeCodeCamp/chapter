import { Request, Response } from 'express';
import { Event } from 'server/models/Event';

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
      if (e.code === '23503' && e.message.includes('foreign key constraint')) {
        if (e.detail.includes('venue')) {
          return res.status(404).json({ message: 'venue not found' });
        }
        if (e.detail.includes('chapter')) {
          return res.status(404).json({ message: 'chapter not found' });
        }
      }

      res.status(500).json({ error: e });
    }
  },

  async update(req: Request, res: Response) {
    const { id, chapterId } = req.params;
    const {
      name,
      //   chapter,
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
      name && (event.name = name);
      //   chapter && (event.chapter = chapter);
      description && (event.description = description);
      capacity && (event.capacity = capacity);
      venue && (event.venue = venue);
      canceled && (event.canceled = canceled);
      start_at && (event.start_at = start_at);
      ends_at && (event.ends_at = ends_at);

      try {
        await event.save();
        res.json(event);
      } catch (e) {
        if (
          e.code === '23503' &&
          e.message.includes('foreign key constraint')
        ) {
          if (e.detail.includes('venue')) {
            return res.status(404).json({ message: 'venue not found' });
          }
          if (e.detail.includes('chapter')) {
            return res.status(404).json({ message: 'chapter not found' });
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
