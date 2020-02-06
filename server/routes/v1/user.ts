import express from 'express';
import asyncHandler from 'express-async-handler';
import userController from 'server/controllers/userController';

const router = express.Router();

router.get('/users', asyncHandler(userController.index));
router.post('/users', asyncHandler(userController.create));
export default router;
