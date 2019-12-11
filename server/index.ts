import dotenv from 'dotenv';
import 'module-alias/register';
import express from 'express';
import morgan from 'morgan';
import { responseErrorHandler } from 'express-response-errors';

import exampleRouter from 'server/routes/exampleRoutes/exampleRouter';
import chapterRouter from 'server/routes/chapter';
import nextjs from 'server/lib/next';
import { initDB } from 'server/db';

dotenv.config();

const app: express.Application = express();

nextjs.nextApp.prepare().then(async () => {
  const port = process.env.PORT || 8000;

  const connection = await initDB;
  await connection.runMigrations();

  app.use(
    morgan(':method :url :status', {
      skip: (req: express.Request) => req.url.startsWith('/_next/'),
    }),
  );
  app.use(express.json());
  app.use(express.static('public'));

  app.use(exampleRouter);
  app.use(chapterRouter);

  app.use(responseErrorHandler);

  app.get('*', (req, res) => {
    nextjs.handle(req, res);
  });

  app.listen(port, () => {
    console.log(`\n\nstarted on port ${port}\n\n`); // tslint:disable-line no-console
  });
});
