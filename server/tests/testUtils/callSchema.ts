import 'reflect-metadata';
import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { createSchema } from './createSchema';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const callSchema = async ({ source, variableValues }: Options) => {
  schema = await createSchema();
  return graphql({
    schema,
    source,
    variableValues,
  });
};
