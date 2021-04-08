import 'reflect-metadata';
import cors from 'cors';
import { join } from 'path';
import express, { Express } from 'express';
import { config } from 'dotenv';
import isDocker from 'is-docker';
import { buildSchema } from 'type-graphql';
import { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';

config({ path: join(__dirname, '../.env') });

import { resolvers } from './controllers';
import { GQLCtx } from './ts/gql';
import { initDB } from './db';

// Make sure to kill the app if using non docker-compose setup and docker-compose
if (isDocker() && process.env.IS_DOCKER === '') {
  console.error(
    '\n\n\nUSING LOCAL DB BUT RUNNING IN DOCKER WILL CAUSE IT TO USE DOCKER-COMPOSE DB INSTEAD OF LOCAL',
  );
  console.error("npm run typeorm WON'T WORK PROPERLY\n\n\n");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

export const main = async (app: Express) => {
  await initDB();
  app.use(cors({ credentials: true, origin: true }));

  const schema = await buildSchema({ resolvers });
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): GQLCtx => ({
      req,
      res,
      // TODO: Handle user/sessions here
      // user: req.user,
    }),
  });

  server.applyMiddleware({ app, cors: false, path: '/graphql' });
};

if (require.main === module) {
  (async () => {
    const app = express();
    await main(app);

    app.listen(PORT, () =>
      console.log(`Listening on http://localhost:${PORT}/graphql`),
    );
  })();
}
