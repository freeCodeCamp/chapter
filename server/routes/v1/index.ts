import express from 'express';

import eventsRouter from './events';
import chaptersRouter from './chapter';
import locationsRouter from './location';
import usersRouter from './user';

const apiV1 = express.Router();

apiV1.use('/api/v1/', eventsRouter);
apiV1.use('/api/v1/', chaptersRouter);
apiV1.use('/api/v1/', locationsRouter);
apiV1.use('/api/v1/', usersRouter);

export { apiV1 };
