import 'module-alias/register';
import express from 'express';
import morgan from 'morgan';
import nextjs from 'server/lib/next';
import { responseErrorHandler } from 'express-response-errors';
import exampleRouter from 'server/routers/exampleRouter';

const app: express.Application = express();

nextjs.nextApp.prepare().then(async () => {
  const port = process.env.PORT || 8000;

  app.use(
    morgan(':method :url :status', {
      skip: (req: express.Request) => req.url.startsWith('/_next/'),
    }),
  );
  app.use(express.json());
  app.use(express.static('public'));

  app.use(exampleRouter);

  app.use(responseErrorHandler);

  app.get('*', (req, res) => {
    nextjs.handle(req, res);
  });

  app.listen(port, () => {
    console.log(`\n\nstarted on port ${port}\n\n`); // tslint:disable-line no-console
  });
});
