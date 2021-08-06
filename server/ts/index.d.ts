import { User } from 'src/models';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
