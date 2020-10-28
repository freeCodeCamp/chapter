import { buildSchema } from 'type-graphql';
import { resolvers } from '../controllers';

export const createSchema = () =>
  buildSchema({
    resolvers,
  });
