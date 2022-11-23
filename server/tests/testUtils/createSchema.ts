import { buildSchema } from 'type-graphql';
import { authorizationChecker } from '../../../common/authorization';

import { resolvers } from '../../src/controllers';

export const createSchema = () =>
  buildSchema({
    resolvers,
    authChecker: authorizationChecker,
  });
