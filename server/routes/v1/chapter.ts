import express from 'express';
import asyncHandler from 'express-async-handler';

import chapterController from 'server/controllers/chapterController';
import userChapterController from 'server/controllers/userChapterController';

const router = express.Router();

router.get('/chapters', asyncHandler(chapterController.index));
router.post('/chapters', asyncHandler(chapterController.create));
router.get('/chapters/:id', asyncHandler(chapterController.show));
router.patch('/chapters/:id', asyncHandler(chapterController.update));
router.delete('/chapters/:id', asyncHandler(chapterController.remove));

router.post(
  '/chapters/:id/join/:user_id',
  asyncHandler(userChapterController.join),
);
router.post(
  '/chapters/:chapter_id/ban/:user_id',
  asyncHandler(userChapterController.ban),
);

export default router;
