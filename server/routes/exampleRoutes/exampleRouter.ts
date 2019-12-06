import express from 'express';

import sampleRoute from './routes/sampleRoute';
import sampleAsyncRoute from './routes/sampleAsyncRoute';
import sampleErroredRoute from './routes/sampleErroredRoute';

const router = express.Router();

router.get('/api/sample-route', sampleRoute);
router.get('/api/sample-async-route', sampleAsyncRoute);
router.get('/api/sample-errored-route', sampleErroredRoute);

export default router;
