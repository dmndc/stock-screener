const users = require('../models/users');
const db = require('../config/db');

let id = 1;

module.exports = {
  login: (req, res, next) => {
    const { session } = req;
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      session.user.username = user.username;
      res.status(200).send(session.user);
    } else {
      res.status(500).send('Unauthorized.');
    }
  },

  register: (req, res, next) => {
    const { session } = req;
    const { username, password } = req.body;

    users.push({ id, username, password });
    id++;

    session.user.username = username;

    res.status(200).send(session.user);
  },

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

  signout: (req, res, next) => {

    const { session } = req;
    session.destroy();
    res.status(200).send(req.session);
  },

  getLogStatus: (req, res, next) => {
    res.status(200).json(req.session);
  },

  logout: (req, res, next) => {
    // req.logout(); THIS IS WEIRD?!!
    req.session.destroy();
    res.status(200).json('logged out');
    res.redirect("http://localhost:3000/");
  },

  getUser: (req, res, next) => {
    const { session } = req;
    res.status(200).send(session.user);
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


  }

}