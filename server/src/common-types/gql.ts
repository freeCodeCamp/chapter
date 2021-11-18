import { Request as ExpressRequest, Response } from 'express';
import { User } from 'src/graphql-types';

// TODO: import from the TypeGraphQL user chapter role object, once that's fixed
// rather than defining it here
export interface ChapterRoles {
  chapter_roles: {
    chapter_id: number;
    role_name: string;
  }[];
}
export interface GQLCtx {
  user?: User & ChapterRoles;
  res: Response;
  req: ExpressRequest;
}

export interface Request extends ExpressRequest {
  user?: User & ChapterRoles;
}
