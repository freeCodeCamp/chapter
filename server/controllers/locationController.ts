import { Request, Response } from 'express';
import { Like } from 'typeorm';
import { InternalServerError, NotFoundError } from 'express-response-errors';

import { Location } from 'server/models/Location';

export default {
  async index(req: Request, res: Response) {
    const { country_code, city, region, postal_code, address } = req.query;

    const locations = await Location.find({
      where: [
        { country_code: Like(`%${country_code}%`) },
        { city: Like(`%${city}%`) },
        { region: Like(`%${region}%`) },
        { postal_code: Like(`%${postal_code}%`) },
        { address: Like(`%${address}%`) },
      ],
    });

    res.json(locations);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const location = await Location.findOne({ id: parseInt(id) });

    if (location) {
      res.json(location);
    } else {
      throw new NotFoundError("Can't find location");
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
      throw new InternalServerError(JSON.stringify({ error: e }));
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
        throw new InternalServerError(JSON.stringify({ error: e }));
      }
    } else {
      throw new NotFoundError("Can't find location");
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
        throw new InternalServerError(JSON.stringify({ error: e }));
      }
    } else {
      throw new NotFoundError("Can't find location");
    }
  },
};
