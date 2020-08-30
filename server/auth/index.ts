import express from 'express';
import Setup from './google/passport';
import googleRouter from './google';

Setup();

const router = express.Router();

router.use('/google', googleRouter);

export default router;
