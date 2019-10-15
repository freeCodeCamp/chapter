// @ts-check

import {Sequelize} from 'sequelize'

// TODO: Use a real DB connection
export const sequelize = new Sequelize('sqlite::memory:');

