import { buildSchema } from 'type-graphql';
import { authorizationChecker } from '../../src/authorization';

import { resolvers } from '../../src/controllers';

export const createSchema = () =>
  buildSchema({
    resolvers,
    authChecker: authorizationChecker,
  });
