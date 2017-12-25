// force: true will drop the table if it already exists
// Stock.sync({force: false}).then(() => {
//   // Table created
//   return Stock.create({
//     symbol: 'DUK',
//     company: 'Duke Energy'
//   });
// });



// const list = require('./listOfStocks.json');

// Stock.bulkCreate(list).catch( err => console.log(err) );


// let listOfSymbols = [];

// const stocks = Stock.findAll({
//   attributes: ['symbol', 'company']
// })
// .then( (stocks) => {
//   stocks.forEach( stock => {
//     // console.log(stock.symbol + ': ' + stock.company);
//     listOfSymbols.push(stock.symbol);
//   })
// })
// .then( () => 
//    console.log('List of symbols: ', listOfSymbols)
// );

// let allStocks = [];

// Stock.findAll()
//   .then(stocks => {
//     stocks.forEach( stock => {
//       allStocks.push(stock.dataValues);
//     })
//   })
//   .then( () => console.log('NU PAS MATER: ', allStocks));


// Get the array of all stocks from the DB
const getStocksFromDb = () => {
  return db.stocks.findAll({
    limit: 30, 
    raw: true, 
    order: [ ['symbol', 'ASC'] ]
  })
    // .then( stock => stock )
    // .then( stocks => {
    //   stocks.forEach( stock => stock.dataValues )
    // })
}


// Get data for a single stock
const apiURL = 'https://api.iextrading.com/1.0';

const getStockData = (stock) => {
  return axios.get(`${apiURL}/stock/${stock}/quote?displayPercent=true`)
    .then( response => response.data )
    .catch( err => console.log(err) );
}

// Update the data from API for all the stocks in the database

const updateStockData = () => {
  // get the symbols of all the stocks in the DB
  Stock.findAll({ attributes: ['symbol'] })
  .then( (stocks) => {
    stocks.forEach( stock => {
      let symbol = stock.symbol;

      // call the API with the current symbol
      getStockData(symbol)
        .then( result => {
          // update the stock with the new data
          Stock.update(result, {where: { symbol: symbol } })
            .then(updatedStock => {
              console.log('Updated stock: ', updatedStock)
            })
            .catch( err => console.log('Err: ', err));
          }
        )
        .catch( err => console.log('Err: ', err));
    })
  });
}

// updateStockData();


// let stock = 'AMZN';
// let data = {};

// const getStockData = (stock) => {
//   return axios.get(`${apiURL}/stock/${stock}/quote?displayPercent=true`)
//     .then( response => response.data )
//     .catch( err => console.log(err) );
// }

// getStockData(stock)
//   .then( result => {
//     console.log('Sto imamo: ', result);
//     Stock.update(result, {where: { symbol: stock } })
//       .then(updatedStock => {
//         console.log('Ma to majstore: ', updatedStock)
//       })
//       .catch( err => console.log('Ne valja ti poso: ', err));
//     }
//   )
//   .catch( err => console.log('Smrt me snasla u tudjini! ', err));




// const updateStockDataInDb = (stock) => {
//   return getStockData(stock)
//     .then( response => {
//       data = response;
//     })
//     .then(
//       () => { console.log('aj da vidim sad: ', data) }
//     );
// }


// data = updateStockDataInDb('MSFT')
//   .then( () => { console.log('NO, jer bus?: ', data) });


// const newData = {
//   sector: 'Technology'
// }

// Stock.update(newData, {where: { symbol: 'MSFT' } })
//   .then(updatedStock => {
//     console.log('Jebi majku: ', updatedStock);
//   })


// const MMM = Stock.findOne( {where : { symbol: 'MMM' }}).then( (stock) => { console.log('Konacno sam ga zvlekel: ', stock.symbol) } );
