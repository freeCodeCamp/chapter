import express from 'express';
import asyncHandler from 'express-async-handler';

import eventsController from 'server/controllers/eventsController';

const router = express.Router();

router.get('/chapters/:chapterId/events', asyncHandler(eventsController.index));
router.post(
  '/chapters/:chapterId/events',
  asyncHandler(eventsController.create),
);
router.get(
  '/chapters/:chapterId/events/:id',
  asyncHandler(eventsController.show),
);
router.patch(
  '/chapters/:chapterId/events/:id',
  asyncHandler(eventsController.update),
);
router.delete(
  '/chapters/:chapterId/events/:id',
  asyncHandler(eventsController.remove),
);

export default router;
