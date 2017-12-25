const db = require('../config/db');

module.exports = {
  getStocks: (req, res, next) => {
    return db.stocks.findAll({
      limit: 505,
      raw: true,
      order: [['symbol', 'ASC']]
    })
      .then(stocks => res.status(200).send(stocks))
      .catch(err => res.status(500).send(err));
  },

  getUserWatchlist: (req, res, next) => {
    let id = req.params.id;
    db.users.findOne({
      where: { id: id },
      include: [
        {
          model: db.stocks
        }
      ]
    })
      .then(user => {
        res.json(user.stocks);
      })
  },

  getStocksBySector: (req, res, next) => {
    let sector = req.params.sector;

    return db.stocks.findAll({
      where: { sector: sector },
      order: [['symbol', 'ASC']],
      raw: true
    })
      .then(stocks => res.status(200).send(stocks))
      .catch(err => res.status(500).send(err));

  },

  getTopGainers: (req, res, next) => {
    db.stocks.findAll({
      limit: 5,
      order: [['changePercent', 'DESC']],
      attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice']
    })
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));
  },

  getTopLosers: (req, res, next) => {
    db.stocks.findAll({
      limit: 5,
      order: [['changePercent', 'ASC']],
      attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice']
    })
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));
  },

  getTopVolume: (req, res, next) => {
    db.stocks.findAll({
      limit: 5,
      order: [['latestVolume', 'DESC']],
      attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice', 'latestVolume']
    })
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));
  },

  filterByPrice: (req, res, next) => {
    const filter = req.params.filter;

    db.stocks.findAll({
      where: { latestPrice: {
          $lt: filter
        }
      },
      order: [['symbol', 'ASC']],
      raw: true
    })
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));
  }

}
