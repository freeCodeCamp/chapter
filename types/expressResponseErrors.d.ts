import { ErrorRequestHandler } from 'express';

declare module 'express-response-errors' {
  export const responseErrorHandler: ErrorRequestHandler;
}
