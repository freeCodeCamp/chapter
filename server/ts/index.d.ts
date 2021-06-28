import { User } from 'server/models';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
