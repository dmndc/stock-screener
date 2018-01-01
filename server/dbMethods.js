const db = require('./config/db');

module.exports = {
  getStocksFromDb: () => {
    return db.stocks.findAll({
      limit: 505,
      raw: true,
      order: [['symbol', 'ASC']]
    })
  },

  filterBySector: (sector) => {
    return db.stocks.findAll({
      where: { sector: sector },
      order: [['symbol', 'ASC']],
      raw: true
    })
  },

  filterByPrice: (priceOperator) => {
    return db.stocks.findAll({
      where: { priceOperator },
      order: [['symbol', 'ASC']],
      raw: true
    })
  },

  getUsers: () => {
    return db.users.findAll({
      raw: true,
      order: [['username', 'ASC']]
    })
  },

  getUserById: (id) => {
    return db.users.findOne({
      id: id
    })
  },

  getUserByAuthId: (AuthId) => {
    return db.users.findOne({
      where: { auth_id: AuthId }
    })
  },

  createUserByAuthId: (authId, email) => {
    return db.users.create({
      auth_id: authId,
      email: email
    })
  },

}
