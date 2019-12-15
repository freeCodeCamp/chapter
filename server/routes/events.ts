import express from 'express';
import asyncHandler from 'express-async-handler';

import eventsController from 'server/controllers/eventsController';

const router = express.Router();

router.get(
  '/api/chapters/:chapter_id/events',
  asyncHandler(eventsController.index),
);
router.post(
  '/api/chapters/:chapter_id/events',
  asyncHandler(eventsController.create),
);
router.get(
  '/api/chapters/:chapter_id/events/:id',
  asyncHandler(eventsController.show),
);
router.patch(
  '/api/chapters/:chapter_id/events/:id',
  asyncHandler(eventsController.update),
);
router.delete(
  '/api/chapters/:chapter_id/events/:id',
  asyncHandler(eventsController.remove),
);

export default router;
