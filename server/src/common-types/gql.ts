import { Request as ExpressRequest, Response } from 'express';

import type { User, Events } from '../controllers/Auth/middleware';

export interface GQLCtx {
  user?: User;
  events?: Events;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User;
  events?: Events;
}
