import express from 'express';
import asyncHandler from 'express-async-handler';
import { BadRequestError } from 'express-response-errors';

const router = express.Router();

router.get('/api/sample-route', (req, res) => {
  const { query } = req;
  res.json({ message: 'Response from the server', query });
});

router.get(
  '/api/sample-async-route',
  asyncHandler(async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { query } = req;
    res.json({ message: 'Delayed response from the server', query });
  }),
);

router.get('/api/sample-errored-route', () => {
  throw new BadRequestError('This route will always error with code 400');
});

export default router;
