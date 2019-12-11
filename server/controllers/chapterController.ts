import { Request, Response } from 'express';
import { Chapter } from 'server/models/Chapter';

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
      res.status(404).json({ error: 'Cant find chapter' });
    }
  },

  async create(req: Request, res: Response) {
    const { name, description, category, details } = req.body;
    const chapter = new Chapter({ name, description, category, details });

    try {
      await chapter.save();
      res.status(201).json(chapter);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, category, details } = req.body;

    const chapter = await Chapter.findOne({ id: parseInt(id) });

    if (chapter) {
      name && (chapter.name = name);
      description && (chapter.description = description);
      category && (chapter.category = category);
      details && (chapter.details = details);

      try {
        await chapter.save();
        res.json(chapter);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: 'Cant find chapter' });
    }
  },
  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const chapter = await Chapter.findOne({ id: parseInt(id) });

    if (chapter) {
      try {
        await chapter.remove();
        res.json({ id });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(404).json({ error: 'Cant find chapter' });
    }
  },
};
