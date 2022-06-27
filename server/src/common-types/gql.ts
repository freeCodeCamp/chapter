import { Request as ExpressRequest, Response } from 'express';

import type { User } from '../controllers/Auth/middleware';

// TODO: User seems to be duplicated.  Both on req.user and in the context. Why?
// Can we get rid of one?
export interface GQLCtx {
  user?: User;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User;
}
