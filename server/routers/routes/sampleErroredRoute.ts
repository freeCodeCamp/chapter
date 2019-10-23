import { BadRequestError } from 'express-response-errors';

export default () => {
  throw new BadRequestError('This route will always error with code 400');
};
