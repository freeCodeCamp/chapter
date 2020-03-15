import { Request, Response } from 'express';
import { InternalServerError, NotFoundError } from 'express-response-errors';

import { Venue } from 'server/models/Venue';

export default {
  async index(_req: Request, res: Response) {
    const venues = await Venue.find();

    res.json(venues);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const venue = await Venue.findOne({ id: parseInt(id) });

    if (venue) {
      res.json(venue);
    } else {
      throw new NotFoundError("Can't find venue");
    }
  },

  async create(req: Request, res: Response) {
    const { name, location } = req.body;

    const venue = new Venue({ name, location });

    try {
      await venue.save();
      res.status(201).json(venue);
    } catch (e) {
      throw new InternalServerError(e.message);
    }
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    const venue = await Venue.findOne({ id: parseInt(id) });

    if (!venue) {
      throw new NotFoundError("Can't find venue");
    }

    venue.name = name ?? venue.name;

    try {
      await venue.save();
      res.json(venue);
    } catch (e) {
      throw new InternalServerError(JSON.stringify({ error: e }));
    }
  },
  async remove(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const venue = await Venue.findOne({ id });

    if (!venue) {
      throw new NotFoundError("Can't find venue");
    }

    try {
      await venue.remove();
      res.json({ id });
    } catch (e) {
      throw new InternalServerError(JSON.stringify({ error: e }));
    }
  },
};
