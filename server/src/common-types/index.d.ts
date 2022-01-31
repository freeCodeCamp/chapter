import { User } from '../graphql-types';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
