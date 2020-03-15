import express from 'express';
import asyncHandler from 'express-async-handler';
import venuesController from 'server/controllers/venuesController';

const router = express.Router();

router.get('/venues', asyncHandler(venuesController.index));
router.post('/venues', asyncHandler(venuesController.create));
router.get('/venues/:id', asyncHandler(venuesController.show));
router.patch('/venues/:id', asyncHandler(venuesController.update));
router.delete('/venues/:id', asyncHandler(venuesController.remove));

export default router;
