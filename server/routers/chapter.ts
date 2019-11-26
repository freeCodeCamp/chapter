import express from 'express';
import asyncHandler from 'express-async-handler';

import chapterController from 'server/controllers/chapterController';

const router = express.Router();

router.get('/api/chapters', asyncHandler(chapterController.index));
router.get('/api/chapters_repo', asyncHandler(chapterController.index_repo)); //TODO: REMOVE THIS IS AN EXAMPLE

router.post('/api/chapters', asyncHandler(chapterController.create));
router.get('/api/chapters/:id', asyncHandler(chapterController.show));
router.patch('/api/chapters/:id', asyncHandler(chapterController.update));
router.delete('/api/chapters/:id', asyncHandler(chapterController.remove));

export default router;
