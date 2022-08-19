import { NextFunction, Request, Response, RequestHandler } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { isProd } from '../../config';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
// TODO: test that this fails in production when the keys are missing.
// or sign a dev JWT and validate that.
// TODO: separate the dev and prod code.
export const checkJwt: RequestHandler = isProd()
  ? auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: `https:///${process.env.AUTH0_DOMAIN}/`,
    })
  : (_req: Request, _res: Response, next: NextFunction) => next();
