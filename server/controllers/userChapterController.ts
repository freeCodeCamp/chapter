import { Request, Response } from 'express';
import { Chapter, User } from 'server/models';
import { UserChapter } from 'server/models/UserChapter';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async join(req: Request, res: Response) {
    const { chapter_id, user_id } = req.body;

    const chapter = await Chapter.findOne({ id: chapter_id });
    const user = await User.findOne({ id: user_id });

    if (chapter && user) {
      const userChapter = new UserChapter({
        user,
        chapter,
      });

      try {
        await userChapter.save();
        res.status(201).json(userChapter);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find user or chapter. Or both." });
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
        res.status(201).json({ id, user_id });
      } catch (e) {
        res.json(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find user record for chapter" });
    }
  },
};
