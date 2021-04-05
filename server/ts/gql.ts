import { Request, Response } from 'express';
// import { User } from '../models/User';

export interface GQLCtx {
  // user?: User;
  res: Response;
  req: Request;
}
