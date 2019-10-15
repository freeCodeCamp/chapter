// @ts-check

// Dynamically sets up all the models in this folder

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import {sequelize} from '../db';

const db = {
  sequelize,
  Sequelize,
};

fs
  .readdirSync(__dirname)
  .filter(file =>
    path.extname(file) === '.js' &&
    file !== 'setup.js',
  )
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    const model = modelModule.default(sequelize)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate();
  }
});
