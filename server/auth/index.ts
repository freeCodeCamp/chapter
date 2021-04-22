import express from 'express';
import setup from './magicLink/passport';
import magicLinkRouter from './magicLink';

setup();

const router = express.Router();

router.use('/magicLink', magicLinkRouter);

export default router;
