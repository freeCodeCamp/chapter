import { Request, Response } from 'express';
import { User } from 'server/models';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async index(_req: Request, res: Response) {
    const users = await User.find();
    res.json(users);
  },

  async create(req: Request, res: Response) {
    const { first_name, last_name, email } = req.body;
    const user = new User({
      first_name,
      last_name,
      email,
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },
};
