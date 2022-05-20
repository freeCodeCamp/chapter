import { Request as ExpressRequest, Response } from 'express';

import { User, ChapterUser } from '../graphql-types';

export interface GQLCtx {
  user?: User & { user_chapters: ChapterUser[] };
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User & { user_chapters: ChapterUser[] };
}
