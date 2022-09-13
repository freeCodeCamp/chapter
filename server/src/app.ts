/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import express, { Express, Response } from 'express';

// import isDocker from 'is-docker';
import { buildSchema } from 'type-graphql';

import { isDev } from './config';
import { authorizationChecker } from './authorization';
import { ResolverCtx, Request } from './common-types/gql';
import { resolvers } from './controllers';
import {
  user,
  events,
  // handleAuthenticationError,
} from './controllers/Auth/middleware';
import { checkJwt } from './controllers/Auth/check-jwt';
import { prisma } from './prisma';
import { getBearerToken } from './util/sessions';
import { fetchUserInfo } from './util/auth0';

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
  // TODO: put env validation in a separate function
  const clientLocation = process.env.CLIENT_LOCATION;

  if (!clientLocation) {
    throw new Error('CLIENT_LOCATION env var is required');
  }
  const allowedOrigins = isDev()
    ? [clientLocation, 'https://studio.apollographql.com']
    : clientLocation;
  const corsOptions = { credentials: true, origin: allowedOrigins };

  app.set('trust proxy', 'uniquelocal');
  app.use(cors(corsOptions));
  app.use(
    cookieSession({
      secret: process.env.SESSION_SECRET,
      domain: process.env.COOKIE_DOMAIN,
      // One week:
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'strict',
      secure: !isDev(),
    }),
  );

  app.post('/login', checkJwt, (req, res, next) => {
    const token = getBearerToken(req);
    if (token) {
      const userInfo = fetchUserInfo(token);
      userInfo
        .then(async ({ email }) => {
          if (!email) throw Error('No email found in user info');
          const user = (await findUser(email)) ?? (await createUser(email));

          try {
            const { id } = await prisma.sessions.upsert({
              where: { user_id: user.id },
              create: { user_id: user.id },
              update: { user_id: user.id },
            });
            if (req.session) req.session.id = id;
            res.send({
              message: 'created session',
            });
            next();
          } catch (err) {
            res.status(500).send({
              message: 'error creating session',
            });
            next(err);
          }
        })
        .catch((err) => {
          console.log('Failed to validate user');
          console.log(err);
        });
    } else {
      next('no bearer token');
    }
  });

  async function findUser(email: string) {
    return await prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  // TODO: use the register resolver instead? Or just delete it? Probably
  // delete.
  async function createUser(email: string) {
    return prisma.users.create({
      data: {
        name: 'place holder',
        email,
        instance_role: {
          connect: {
            name: 'member',
          },
        },
      },
    });
  }

  // no need to check for identity provider's token on logout
  app.delete('/logout', (req, res, next) => {
    if (!req.session) return next('session not found');

    const id = req.session.id;
    req.session = null;

    prisma.sessions
      .delete({ where: { id } })
      .then(() => {
        res.send({
          message: 'destroyed session',
        });
        next();
      })
      .catch((err) => {
        // TODO: what to do when the request to delete the session fails? This
        // should only happen if the session is malformed or doesn't exist.
        res.status(400).send({
          message: 'unable to destroy session',
        });
        next(err);
      });
  });

  // userMiddleware must be added *after* the login and out routes, since they
  // are only concerned with creating and destroying sessions and not with using
  // them.
  app.use(user);
  app.use(events);
  // TODO: figure out if any extra handlers are needed or we can rely on checkJwt
  // app.use(handleAuthenticationError);

  const schema = await buildSchema({
    resolvers,
    authChecker: authorizationChecker,
  });
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): ResolverCtx => ({
      req,
      res,
      user: req.user,
      events: req.events,
    }),
    csrfPrevention: true,
  });

  await server.start();

  server.applyMiddleware({ app, cors: corsOptions, path: '/graphql' });
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
