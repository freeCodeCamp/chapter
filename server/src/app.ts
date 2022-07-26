import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Express, Response } from 'express';
// import isDocker from 'is-docker';
import { buildSchema } from 'type-graphql';

import { authorizationChecker } from './authorization';
import { GQLCtx, Request } from './common-types/gql';
import { resolvers } from './controllers';
import {
  userMiddleware,
  events,
  handleAuthenticationError,
} from './controllers/Auth/middleware';

// TODO: reinstate these checks (possibly using an IS_DOCKER env var)
// // Make sure to kill the app if using non docker-compose setup and docker-compose
// if (isDocker() && process.env.DB_PORT !== '54320') {
//   console.error(
//     '\n\n\nUSING LOCAL DB BUT RUNNING IN DOCKER WILL CAUSE IT TO USE DOCKER-COMPOSE DB INSTEAD OF LOCAL',
//   );
//   console.error("the db:* commands WON'T WORK PROPERLY\n\n\n");
//   process.exit(1);
// }

const PORT = process.env.PORT || 5000;

export const main = async (app: Express) => {
  app.use(cors({ credentials: true, origin: true }));
  app.use(userMiddleware);
  app.use(events);
  app.use(handleAuthenticationError);

  const schema = await buildSchema({
    resolvers,
    authChecker: authorizationChecker,
  });
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): GQLCtx => ({
      req,
      res,
      user: req.user,
      events: req.events,
    }),
  });

  await server.start();

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
