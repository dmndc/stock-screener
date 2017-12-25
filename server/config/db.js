'use strict'

const Sequelize = require('sequelize');
require('dotenv').config();


// Database Connection
const URI = process.env.CONNECTION_STRING;

const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    timestamps: false
  }
});


// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Models/tables
db.users = require('../models/users')(sequelize, Sequelize);
db.stocks = require('../models/stocks')(sequelize, Sequelize);
db.userstocks = require('../models/userstocks')(sequelize, Sequelize);
// db.users.hasMany(db)

// Relations
// const UserStocks = sequelize.define('userstocks');

db.users.belongsToMany(db.stocks, { through: 'userstocks' });
db.stocks.belongsToMany(db.users, { through: 'userstocks' });


module.exports = db;
