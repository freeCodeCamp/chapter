import { Request as ExpressRequest, Response } from 'express';

import type { User, Events, Venues } from '../controllers/Auth/middleware';

export interface ResolverCtx {
  user?: User;
  events?: Events;
  venues?: Venues;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User;
  events?: Events;
  venues?: Venues;
}
