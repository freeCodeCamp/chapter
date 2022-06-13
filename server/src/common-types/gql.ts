import { Request as ExpressRequest, Response } from 'express';

import { UserWithRoles } from '../graphql-types';

// TODO: User seems to be duplicated.  Both on req.user and in the context. Why?
// Can we get rid of one?
export interface GQLCtx {
  user?: UserWithRoles;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: UserWithRoles;
}
