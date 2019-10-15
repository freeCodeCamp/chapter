// @ts-check

import  {DataTypes, Model} from 'sequelize'
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';

class Group extends Model {
  static tableName = 'groups';
  static Creator = undefined;

  static associate() {
    // NOOP for now
  }
}

export default (sequelize) => {
  Group.init({
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    description: {
      type: new DataTypes.STRING(1024 * 24),
      allowNull: false,
    },
    details: {
      type: DataTypes.JSONB
    },
  }, {
    sequelize, 
    modelName: 'group'
  });

  return Group
}

const groupGQLType = new GraphQLObjectType({
  name: 'Group',
  description: 'A group of people',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the group.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the group.',
    }
  }
});

export {
  Group,
  groupGQLType,
}
