import { Request as ExpressRequest, Response } from 'express';

import type { User } from '../controllers/Auth/middleware';

export interface GQLCtx {
  user?: User;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User;
}
