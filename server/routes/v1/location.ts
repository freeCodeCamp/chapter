import express from 'express';
import asyncHandler from 'express-async-handler';
import locationController from 'server/controllers/locationController';

const router = express.Router();

router.get('/locations', asyncHandler(locationController.index));
router.post('/locations', asyncHandler(locationController.create));
router.get('/locations/:id', asyncHandler(locationController.show));
router.patch('/locations/:id', asyncHandler(locationController.update));
router.delete('/locations/:id', asyncHandler(locationController.remove));

export default router;
