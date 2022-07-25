/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import express, { Express, Response } from 'express';
import fetch from 'node-fetch';
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
  app.use(cors({ credentials: true, origin: process.env.CLIENT_LOCATION }));
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
    // TODO: handle situations where a user is logged in previously (and so has
    // an entry in the sessions table), but has since deleted their session
    // cookie.
    // TODO: put bearer acquisition somewhere sensible
    const bearerRaw = req.headers.authorization;
    if (bearerRaw) {
      const bearerToken = bearerRaw.split(' ')[1];
      fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then(async (userInfoRes) => {
          const userInfo = await userInfoRes.json();
          if (!userInfo.email) throw Error('No email found in user info');
          const user =
            (await findUser(userInfo)) ?? (await createUser(userInfo));

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

  async function findUser(userInfo: { email: string }) {
    return await prisma.users.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  // TODO: use the register resolver instead? Or just delete it? Probably
  // delete.
  async function createUser(userInfo: { email: string }) {
    return prisma.users.create({
      data: {
        first_name: 'place', // TODO: userInfo has 'name'. Do we want to bother with first_name + last_name??
        last_name: 'holder',
        email: userInfo.email,
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
    // TODO: handle situations where a user is logged in previously (and so has
    // an entry in the sessions table), but has since deleted their session
    // cookie.
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
