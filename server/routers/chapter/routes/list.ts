import asyncHandler from 'express-async-handler';

import { Chapter } from 'server/models/chapter';

export default asyncHandler(async (_req, res) => {
  const chapters = await Chapter.findAll();

  res.json(chapters);
});
