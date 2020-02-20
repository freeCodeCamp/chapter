import express from 'express';

import eventsRouter from './events';
import chaptersRouter from './chapter';
import locationRouter from './location';

const apiV1 = express.Router();

apiV1.use('/api/v1/', eventsRouter);
apiV1.use('/api/v1/', chaptersRouter);
apiV1.use('/api/v1/', locationRouter);

export { apiV1 };
