import express from 'express';
import Setup from './google/passport';
import googleRouter from './google';
import authRouter from './auth';

Setup();

const router = express.Router();

router.use('/', authRouter);
router.use('/google', googleRouter);

export default router;
