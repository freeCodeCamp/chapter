import express from 'express';

import eventsRouter from './events';
import chaptersRouer from './chapter';

const apiV1 = express.Router();

apiV1.use('/api/v1/', eventsRouter);
apiV1.use('/api/v1/', chaptersRouer);

export { apiV1 };
