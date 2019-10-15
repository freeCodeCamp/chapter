// @ts-check

// Allows infinite dependencies for the models (e.g. User depends on Group, which depends on User etc)
import "./models/setup"

import { User } from "./models/User";

import express from "express";
import graphqlHTTP from "express-graphql";
import { createConnection } from "graphql-sequelize";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { groupGQLType } from "./models/Group";


// TODO: This could probably go into User
const userGroupsConnection = createConnection({
  name: 'userGroups',
  nodeType: groupGQLType,
  target: User.Groups,
});

// The root of the GraphQL API, currently just has a users query field
const root = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: userGroupsConnection.connectionType,
      args: userGroupsConnection.connectionArgs,
      resolve: userGroupsConnection.resolve
    }
  }
})

const schema = new GraphQLSchema({ query: root });
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(3000, () => {
  console.log(`API started`);
  console.log(` - GraphQL:  http://localhost:3000/graphql`);
});
