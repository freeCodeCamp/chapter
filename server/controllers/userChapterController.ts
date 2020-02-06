import { Request, Response } from 'express';
import { Chapter } from 'server/models/Chapter';
import { PostgresErrorCodes } from 'server/util/PostgresErrorConstants';
import { UserChapter } from 'server/models/UserChapter';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async index(_req: Request, res: Response) {
    const chapters = await Chapter.find();

    res.json(chapters);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const chapter = await Chapter.findOne({ id: parseInt(id) });

    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ error: "Can't find chapter" });
    }
  },

  async create(req: Request, res: Response) {
    const {
      name,
      description,
      category,
      details,
      location,
      creator,
    } = req.body;

    // handle creator diffrenetly in the future (from cookie?)

    const chapter = new Chapter({
      name,
      description,
      category,
      details,
      location,
      creator,
    });

    try {
      await chapter.save();
      res.status(201).json(chapter);
    } catch (e) {
      if (e.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
        if (e.detail.includes('location')) {
          return res.status(400).json({ message: 'location not found' });
        }
        if (e.detail.includes('user')) {
          return res.status(400).json({ message: 'creator not found' });
        }
      }

      res.status(500).json({ error: e });
    }
  },
  async ban(req: Request, res: Response) {
    const { id, user_id } = req.params;
    const userChapter = await UserChapter.findOne({
      where: { user_id: parseInt(user_id), chapter_id: parseInt(id) },
    });

    if (userChapter) {
      try {
        await userChapter.remove();
        res.json({ id, user_id });
      } catch (e) {
        res.json(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find user record for chapter" });
    }
  },
};
