import express from 'express';
import setup from './google/passport';
import googleRouter from './google';
import authRouter from './auth';

setup();

const router = express.Router();

router.use('/', authRouter);
router.use('/google', googleRouter);

export default router;
