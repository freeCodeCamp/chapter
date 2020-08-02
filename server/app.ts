import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import isDocker from 'is-docker';

config();

import { resolvers } from './controllers';
import { IGQLCtx } from './ts/gql';
import { initDB } from './db';

// Make sure to kill the app if using non docker-compose setup and docker-compose
if (isDocker() && process.env.IS_DOCKER === '') {
  console.error(
    '\n\n\nUSING LOCAL DB BUT RUNNING IN DOCKER WILL CAUSE IT TO USE DOCKER-COMPOSE DB INSTEAD OF LOCAL',
  );
  console.error("npm run typeorm WON'T WORK PROPERLY\n\n\n");
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

async function main() {
  await initDB();
  const app = express();

  app.use(cors({ credentials: true, origin: true }));

  const schema = await buildSchema({ resolvers, validate: false });
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): IGQLCtx => ({
      req,
      res,
      // TODO: Handle user/sessions here
      // user: req.user,
    }),
  });

  server.applyMiddleware({ app, cors: false, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}/graphql`);
  });
}

main().catch(err => {
  console.log(err);
});
