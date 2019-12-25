import express from 'express';
import asyncHandler from 'express-async-handler';

import chapterController from 'server/controllers/chapterController';

const router = express.Router();

router.get('/chapters', asyncHandler(chapterController.index));
router.post('/chapters', asyncHandler(chapterController.create));
router.get('/chapters/:id', asyncHandler(chapterController.show));
router.patch('/chapters/:id', asyncHandler(chapterController.update));
router.delete('/chapters/:id', asyncHandler(chapterController.remove));

export default router;
