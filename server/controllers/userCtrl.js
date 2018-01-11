const users = require('../models/users');
const db = require('../config/db');

const { getUserByAuthId } = require('./../dbMethods.js');


module.exports = {

  createUser: (req, res, next) => {
    const { username, password, email } = req.body;

    db.users.create({
      username: username,
      password: password,
      email: email
    })
      .then(newUser => {
        res.json(newUser);
      })
      .catch(err => console.log(err));

  },

  getLogStatus: (req, res, next) => {
    res.status(200).json(req.session);
  },

  logout: (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
  },

  getUser: (req, res, next) => {
    if (!req.user) {
      res.redirect('/login');
    } else {
      req.user === req.session.passport.user
      let auth_id = req.user.id;

      getUserByAuthId(auth_id)
        .then(user => {
          res.status(200).send(user);
        })
    }
  },

  getUserById: (req, res, next) => {
    let id = req.params.id;

    db.users.findOne({
      where: { id: id }
    })
      .then(user => res.status(200).send(user))
      .catch(err => res.status(500).send(err));
  },

  getUsers: (req, res, next) => {
    db.users.findAll({
      raw: true,
      order: [['username', 'ASC']]
    })
      .then(users => res.status(200).send(users))
      .catch(err => res.status(500).send(err));
  },

  addToWatchlist: (req, res, next) => {
    const { user, symbol } = req.body;

    let id = db.stocks.findOne({
      where: { symbol: symbol }
    })
      .then(response => {
        db.userstocks.create({
          user_id: user,
          stock_id: response.id
        })
          .then(response => res.status(200).json("Added to watchlist"))
          .catch(console.log);
      })
  },

  addToFavorites: (req, res, next) => {
    let stock = req.body.stock;
    if (!req.session.favorites) {
      req.session.favorites = [];
    }
    req.session.favorites.push(stock); //add item to favorites
    return res.json(req.session.favorites);
  },

  getUserPassportInfo: (req, res, next) => {
    if (!req.user) {
      res.redirect('/login');
    } else {
      req.user === req.session.passport.user
      res.status(200).send(JSON.stringify(req.user, null, 10));
    }
  }

}
