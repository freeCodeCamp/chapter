import { User } from 'src/graphql-types';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
