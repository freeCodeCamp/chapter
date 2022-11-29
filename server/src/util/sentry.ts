import * as Sentry from '@sentry/node';
import { RequestHandler } from 'express';

export const hasSentry = !!process.env.SENTRY_DSN;

const _handler: RequestHandler = (_req, _res, next) => next();

export const sentryRequestHandler = () => {
  return hasSentry ? Sentry.Handlers.requestHandler() : _handler;
};

export const sentryErrorHandler = () => {
  return hasSentry ? Sentry.Handlers.errorHandler() : _handler;
};
