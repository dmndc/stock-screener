// const Sequelize = require('sequelize');
// // const db = require('./config/db');
// const axios = require('axios');

// require('dotenv').config();


// // Database Connection
// const URI = process.env.CONNECTION_STRING;


// const sequelize = new Sequelize(URI, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: true
//   },
//   define: {
//     charset: 'utf8',
//     collate: 'utf8_general_ci', 
//     timestamps: false
//   }
// });


// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });



// // Get the array of all stocks from the DB
// const getStocksFromDb = () => {
//   return db.stocks.findAll({
//     limit: 30, 
//     raw: true, 
//     order: [ ['symbol', 'ASC'] ]
//   })
// }

// // Array of stocks filtered by sector
// const filterBySector = (sector) => {
//   return db.stocks.findAll({
//     where: { sector: sector },
//     order: [ ['symbol', 'ASC'] ],
//     raw: true 
//   })
// }

// // Array of stocks filtered by price
// const filterByPrice = (priceOperator) => {
//   return db.stocks.findAll({
//     where: { priceOperator },
//     order: [ ['symbol', 'ASC'] ],
//     raw: true 
//   })
// }



// module.exports = {
//   getStocksFromDb,
//   filterBySector,
//   filterByPrice
// }