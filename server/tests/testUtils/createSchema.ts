import { buildSchema } from 'type-graphql';

import { resolvers } from '../../src/controllers';

export const createSchema = () =>
  buildSchema({
    resolvers,
  });
