/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';
import crypto from 'crypto';

import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import express, { Express, NextFunction, Response } from 'express';
import cookies from 'cookie-parser';
// coverage is included as production dependency, even though it's just used for
// testing. This is necessary so that the testing can be kept as close to
// production-like as possible.
import coverage from '@cypress/code-coverage/middleware/express';
// import isDocker from 'is-docker';
import { buildSchema } from 'type-graphql';

import { Permission } from '../../common/permissions';
import { isDev } from './config';
import { authorizationChecker } from './authorization';
import { ResolverCtx, Request } from './common-types/gql';
import { resolvers } from './controllers';
import { handleError, user } from './controllers/Auth/middleware';
import { checkJwt } from './controllers/Auth/check-jwt';
import { prisma, RECORD_MISSING } from './prisma';
import { getBearerToken } from './util/sessions';
import { fetchUserInfo } from './util/auth0';
import { getGoogleAuthUrl, requestTokens } from './services/Google';

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
  app.use(cookies());
  app.set('trust proxy', 'uniquelocal');
  app.use(cors(corsOptions));
  app.use(
    cookieSession({
      secret: process.env.SESSION_SECRET,
      domain: process.env.COOKIE_DOMAIN,
      // One week:
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: !isDev(),
    }),
  );

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

  // no need to check for identity provider's token on logout
  app.delete('/logout', (req, res, next) => {
    const id = req.session?.id;
    req.session = null;
    if (!id) return res.end();

    prisma.sessions
      .delete({ where: { id } })
      .then(() => {
        res.send({
          message: 'destroyed session',
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: 'unable to destroy session',
        });
        // Missing sessions can happen and there's no need to log when they do.
        if (err.code !== RECORD_MISSING) next(err);
      });
  });

  // userMiddleware must be added *after* the login and out routes, since they
  // are only concerned with creating and destroying sessions and not with using
  // them.
  app.use(user);
  if (process.env.NODE_ENV !== 'development') {
    app.use(handleError);
  }

  function canAuthWithGoogle(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      return next(
        'This is a protected route, please login before accessing it',
      );
    }
    // TODO: use isAllowedByInstanceRole instead
    const canAuthenticate =
      req.user.instance_role.instance_role_permissions.some(
        ({ instance_permission }) =>
          instance_permission.name === Permission.GoogleAuthenticate,
      );
    if (!canAuthenticate) {
      return next(
        'Only users with the GoogleAuthenticate permission can access this route',
      );
    }
    next();
  }

  app.get('/authenticate-with-google', canAuthWithGoogle, (_req, res) => {
    const state = crypto.randomUUID();
    res.cookie('state', state, {
      httpOnly: true,
      secure: !isDev(),
      sameSite: 'lax',
    });

    const authUrl = getGoogleAuthUrl(state);
    res.redirect(authUrl);
  });

  app.get('/google-oauth2callback', canAuthWithGoogle, (req, res, next) => {
    if (req.query.state !== req.cookies.state) {
      return next('Client cookie and OAuth2 state do not match');
    }
    const code = req.query.code;
    if (!code || typeof code !== 'string') return next('Invalid Google code');

    requestTokens(code)
      .then(() => {
        res.send('Authentication successful');
      })
      .catch((err) => {
        next(err);
      });
  });

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
      venues: req.venues,
    }),
    csrfPrevention: true,
  });

  await server.start();

  server.applyMiddleware({ app, cors: corsOptions, path: '/graphql' });
};

if (require.main === module) {
  (async () => {
    const app = express();
    // @ts-expect-error this will exist if nyc starts the app
    if (global.__coverage__) {
      console.log('Adding coverage middleware for express');
      coverage(app);
    }
    await main(app);

    app.listen(PORT, () =>
      console.log(`Listening on http://localhost:${PORT}/graphql`),
    );
  })();
}
