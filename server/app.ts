import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { resolvers } from './controllers';
import { IGQLCtx } from './ts/gql';

async function main() {
  await createConnection();
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

  server.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log('Listening on http://localhost:4000/graphql');
  });
}

main().catch(err => {
  console.log(err);
});
