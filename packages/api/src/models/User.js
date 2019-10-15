// @ts-check

import  {DataTypes, Model} from 'sequelize'
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { Group } from './Group';

class User extends Model {
  static tableName = 'users';
  static Groups = undefined;

  static associate() {
    // TODO: make this conform to the .sql spec
    User.Groups = Group.belongsTo(User, {
      as: 'owner',
    });
  }
}

export default (sequelize) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    last_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    }
  }, {
    sequelize, 
    modelName: User.tableName
  });
  
  return User
}

const userGQLType = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the user.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the user.',
    },
  }
});


export {
  User,
  userGQLType,
}
