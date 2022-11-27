import { inspect } from 'util';
import * as Sentry from '@sentry/node';

import { redactSecrets } from '../util/redact-secrets';

const hasSentry = !!process.env.SENTRY_DSN;

interface ErrorLogger {
  err: any;
  message: any;
}

const logToSentry = (message: any) => {
  Sentry.captureMessage(message);
};

const errorToSentry = ({ err, message }: ErrorLogger) => {
  Sentry.addBreadcrumb({
    message,
    level: 'error',
  });
  Sentry.captureException(redactSecrets(err));
};

const logToConsole = (message: any) => {
  console.log(message);
};

const errorToConsole = ({ err, message }: ErrorLogger) => {
  console.error(message);
  console.error(inspect(redactSecrets(err), { depth: null }));
};

export const log = (message: any) => {
  const logger = hasSentry ? logToSentry : logToConsole;
  logger(message);
};

export const logError = ({ err, message }: ErrorLogger) => {
  const logger = hasSentry ? errorToSentry : errorToConsole;
  logger({ err, message });
};
