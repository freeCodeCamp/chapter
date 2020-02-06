import express from 'express';
import asyncHandler from 'express-async-handler';
import locationController from 'server/controllers/locationController';

const router = express.Router();

router.get('/locations', asyncHandler(locationController.index));
router.post('/locations', asyncHandler(locationController.create));
export default router;
