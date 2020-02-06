import { Request, Response } from 'express';
import { Location } from 'server/models';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async index(_req: Request, res: Response) {
    const locations = await Location.find();

    res.json(locations);
  },

  async create(req: Request, res: Response) {
    const { country_code, city, region, postal_code } = req.body;
    const location = new Location({
      country_code,
      city,
      region,
      postal_code,
    });

    try {
      await location.save();
      res.status(201).json(location);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },
};
