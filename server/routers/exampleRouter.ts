import express from 'express';

import sampleRoute from 'server/routers/routes/sampleRoute';
import sampleAsyncRoute from 'server/routers/routes/sampleAsyncRoute';
import sampleErroredRoute from 'server/routers/routes/sampleErroredRoute';

const router = express.Router();

router.get('/api/sample-route', sampleRoute);
router.get('/api/sample-async-route', sampleAsyncRoute);
router.get('/api/sample-errored-route', sampleErroredRoute);

export default router;
