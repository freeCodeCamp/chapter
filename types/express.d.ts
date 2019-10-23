import { Request } from 'express';

declare module 'express' {
  interface Request {
    // custom stuff here in the future
    a: string;
  }
}
