import { User } from 'models';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
