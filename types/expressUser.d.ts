import { User } from 'server/models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
  }
}
