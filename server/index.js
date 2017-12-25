const express = require('express');
const session = require('express-session');
const { json } = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const strategy = require('./auth/strategy');
const axios = require('axios');


// Import DB methods
const { getUserByAuthId, createUserByAuthId } = require('./dbMethods');


const Auth0Strategy = require('passport-auth0');
const { AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env;

// Sequelize.js
const Sequelize = require('sequelize');
const db = require('./config/db');

require('dotenv').config();

// Middleware
const checkForSession = require('./middlewares/checkForSession');

// Controllers
const userCtrl = require('./controllers/userCtrl');
const stocksCtrl = require('./controllers/stocksCtrl');


const app = express();


// // Database Connection
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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



// Server build files

app.use(express.static(`${__dirname}/build`));


// Middlewares
app.use(json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(cors());
app.use(checkForSession);


// Auth
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Auth0Strategy(
    {
      domain: AUTH_DOMAIN,
      clientID: AUTH_CLIENT_ID,
      clientSecret: AUTH_CLIENT_SECRET,
      callbackURL: '/login'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      console.log('AAAA', profile);

      getUserByAuthId(profile._json.user_id)
        .then(res => {

          if (!res) {
            createUserByAuthId(profile._json.user_id, profile._json.email)
              .then(created => {
                console.log(created);
                return done(null, created);
              });
          }
        })
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


// AUTH endpoints

app.get('/login',
  passport.authenticate('auth0',
    { successRedirect: 'http://localhost:3000/', failureRedirect: '/login', failureFlash: true }
  )
)

app.get("/api/logstatus", userCtrl.getLogStatus);
app.get("/logout", userCtrl.logout);



app.post('/api/favorites', (req, res, next) => {
  let stock = req.body.stock;
  if (!req.session.favorites) {
    req.session.favorites = [];
  }
  req.session.favorites.push(stock); //add item to favorites
  return res.json(req.session.favorites);
})


app.get('/me', (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    req.user === req.session.passport.user
    // console.log( req.user )
    // console.log( req.session.passport.user );


    res.status(200).send(JSON.stringify(req.user, null, 10));
  }
});

app.get('/api/user', (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    req.user === req.session.passport.user
    let auth_id = req.user.id;

    getUserByAuthId(auth_id)
      .then(user => {
        res.status(200).send(user);
      })

    // getUserByAuthId(auth_id)
    //   .then( user => {
    //     res.status(200).send(user);
    //   });

  }
})


// // Auth Endpoints 
// app.post( '/api/login', auth_controller.login );
// app.post( '/api/register', auth_controller.register );
// app.post( '/api/signout', auth_controller.signout );
// app.get( '/api/user', auth_controller.getUser );




// Endpoints

// GET USER INFO
app.get('/api/user/:id', userCtrl.getUserById)

// GET ALL USERS
app.get('/api/users', userCtrl.getUsers);

// CREATE USER
app.post('/api/user/add', userCtrl.createUser);

// ADD STOCK TO USER'S WATCHLIST 
app.post('/api/watchlist', userCtrl.addToWatchlist);

// Used for pagination and InfiniteScroll in Tiles Component
// app.get('/api/stocks/page/:page', (req, res, next) => {
//   let limit = 20;
//   let offset = 0;

//   db.stocks.findAndCountAll()
//     .then((data) => {
//       let page = req.params.page; // page number
//       let pages = Math.ceil(data.count / limit);
//       offset = limit * (page - 1);

//       db.stocks.findAll({
//         limit: limit,
//         offset: offset,
//         order: ['company']
//         // $sort: { symbol: 1}
//       })
//         .then((stocks) => {
//           res.status(200).json({ 'stocks': stocks, 'count': data.count, 'pages': pages });
//         });
//     })
//     .catch(function (error) {
//       res.status(500).send('Internal Server Error');
//     });
// });



// GET STOCKS FROM USER'S WATCHLIST
app.get('/api/user/:id/stocks', stocksCtrl.getUserWatchlist);

// GET ALL STOCKS FROM DB
app.get('/api/stocks', stocksCtrl.getStocks);

// GET STOCKS FROM DEFINED SECTOR
app.get('/api/stocks/:sector', stocksCtrl.getStocksBySector);

// GET STOCKS PRICED LESS THAN FILTER VALUE
app.get('/api/stocks/price/:filter', stocksCtrl.filterByPrice);

// GET STOCKS WITH HIGHEST PERCENTAGE GAIN
app.get('/api/top/gainers', stocksCtrl.getTopGainers);

// GET STOCKS WITH HIGHEST PERCENTAGE LOSS
app.get('/api/top/losers', stocksCtrl.getTopLosers);

// GET STOCKS WITH HIGHEST VOLUME
app.get('/api/top/volume', stocksCtrl.getTopVolume);

// GET LIST OF SECTORS AND YTD PERCENT CHANGE
app.get('/api/sectors', (req, res, next) => {
  db.stocks.findAll({
    group: ['sector'],
    attributes: ['sector', [sequelize.fn('avg', sequelize.col('ytdchange')), 'AvgPercent']],

  })
  .then(sectors => res.status(200).send(sectors))
  .catch(err => res.status(500).send(err));
});


// Server port
const port = 3001;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
