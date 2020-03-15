import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import isDocker from 'is-docker';
import { responseErrorHandler } from 'express-response-errors';
import swaggerUi from 'swagger-ui-express';

import nextjs from 'server/lib/next';
import { initDB } from 'server/db';
import { apiV1 } from './routes';
import swaggerDocument from '../api/swagger.json';

dotenv.config();

const app: express.Application = express();

// Make sure to kill the app if using non docker-compose setup and docker-compose
if (isDocker() && process.env.IS_DOCKER === '') {
  console.error(
    '\n\n\nUSING LOCAL DB BUT RUNNING IN DOCKER WILL CAUSE IT TO USE DOCKER-COMPOSE DB INSTEAD OF LOCAL',
  );
  console.error("npm run typeorm WON'T WORK PROPERLY\n\n\n");
  process.exit(1);
}

nextjs.nextApp.prepare().then(async () => {
  const port = process.env.PORT || 8000;

  await initDB();
  // await connection.runMigrations();

  app.use(
    morgan(':method :url :status', {
      skip: (req: express.Request) => req.url.startsWith('/_next/'),
    }),
  );
  app.use(express.json());
  app.use(express.static('public'));

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(apiV1);

  app.use(responseErrorHandler);

  app.get('*', (req, res) => {
    nextjs.handle(req, res);
  });

  app.listen(port, () => {
    console.log(`\n\nstarted on port ${port}\n\n`); // tslint:disable-line no-console
  });
});
