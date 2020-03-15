import { Request, Response } from 'express';
import { InternalServerError, NotFoundError } from 'express-response-errors';

import { Venue, Location } from 'server/models';

export default {
  async index(_req: Request, res: Response) {
    const venues = await Venue.find({
      relations: ['location'],
      order: { created_at: 'DESC' },
    });

    res.json(venues.map(venue => ({ ...venue, location: venue.location })));
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const venue = await Venue.findOne(
      { id: parseInt(id) },
      { relations: ['location'] },
    );

    if (venue) {
      res.json({ ...venue, location: venue.location });
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
      throw new InternalServerError(JSON.stringify({ error: e.message }));
    }
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, location } = req.body;

    const newLocation = await Location.findOne({ id: parseInt(location) });
    const venue = await Venue.findOne({ id: parseInt(id) });

    if (!venue) {
      throw new NotFoundError("Can't find venue");
    }

    venue.name = name ?? venue.name;

    if (newLocation) {
      venue.location = newLocation;
    }

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
