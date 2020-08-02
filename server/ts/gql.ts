import { Request, Response } from 'express';
// import { User } from '../models/User';

export interface IGQLCtx {
  // user?: User;
  res: Response;
  req: Request;
}
