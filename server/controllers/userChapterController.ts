import { Request, Response } from 'express';
import { Chapter, User } from 'server/models';
import { UserChapterRole } from 'server/models/UserChapterRole';

// The whole model is a json response, fix that if there's some sensitive data here

export default {
  async join(req: Request, res: Response) {
    const { chapter_id, user_id } = req.body;

    const chapter = await Chapter.findOne({ id: chapter_id });
    const user = await User.findOne({ id: user_id });

    if (chapter && user) {
      const userChapterRole = new UserChapterRole({
        userId: user_id,
        chapterId: chapter_id,
        roleName: 'member',
      });

      try {
        await userChapterRole.save();
        res.status(201).json(userChapterRole);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find user or chapter. Or both." });
    }
  },
  async ban(req: Request, res: Response) {
    const { id, user_id } = req.params;
    const userChapterRole = await UserChapterRole.findOne({
      where: { user_id: parseInt(user_id), chapter_id: parseInt(id) },
    });

    if (userChapterRole) {
      try {
        await userChapterRole.remove();
        res.status(201).json({ id, user_id });
      } catch (e) {
        res.json(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: "Can't find user record for chapter" });
    }
  },
};
