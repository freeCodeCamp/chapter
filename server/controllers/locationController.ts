import { Request, Response } from 'express';
import { Location } from 'server/models/Location';

export default {
  async index(_req: Request, res: Response) {
    const locations = await Location.find();

    res.json(locations);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const location = await Location.findOne({ id: parseInt(id) });

    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ error: "Can't find location" });
    }
  },

  async create(req: Request, res: Response) {
    const { country_code, city, region, postal_code, address } = req.body;

    const location = new Location({
      country_code,
      city,
      region,
      postal_code,
      address,
    });

    try {
      await location.save();
      res.status(201).json(location);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { country_code, city, region, postal_code, address } = req.body;

    const location = await Location.findOne({ id: parseInt(id) });

    if (location) {
      location.country_code = country_code ?? location.country_code;
      location.city = city ?? location.city;
      location.region = region ?? location.region;
      location.postal_code = postal_code ?? location.postal_code;

      if (address !== undefined) {
        location.address = address;
      }

      try {
        await location.save();
        res.json(location);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find location" });
    }
  },
  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const location = await Location.findOne({ id: parseInt(id) });

    if (location) {
      try {
        await location.remove();
        res.json({ id });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find location" });
    }
  },
};
