const express = require('express');
const session = require('express-session');
const { json } = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import DB methods
const { getUserByAuthId, createUserByAuthId } = require('./dbMethods');

// Passport & Auth0
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const { AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env;

// Sequelize.js
const Sequelize = require('sequelize');
const db = require('./config/db');


// Middleware
const checkForSession = require('./middlewares/checkForSession');

// Controllers
const userCtrl = require('./controllers/userCtrl');
const stocksCtrl = require('./controllers/stocksCtrl');


const app = express();


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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Server build files
app.use(express.static(`${__dirname}/../build`));


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

      getUserByAuthId(profile._json.user_id)
        .then(res => {

          if (!res) {
            createUserByAuthId(profile._json.user_id, profile._json.email)
              .then(created => {
                return done(null, created);
              });
          }
        })
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

// AUTH0 LOGIN
app.get('/login',
  passport.authenticate('auth0',
    { successRedirect: '/', failureRedirect: '/login', failureFlash: true }
  )
)

// LOGOUT 
app.get("/logout", userCtrl.logout);

// GET USER PASSPORT INFO
app.get('/me', userCtrl.getUserPassportInfo);

// GET SESSION OBJECT
app.get("/api/logstatus", userCtrl.getLogStatus);

// GET USER INFO FROM DB
app.get('/api/user', userCtrl.getUser);

// GET USER INFO
app.get('/api/user/:id', userCtrl.getUserById)

// CREATE USER
app.post('/api/user/add', userCtrl.createUser);

// GET ALL USERS
app.get('/api/users', userCtrl.getUsers);

// ADD STOCK TO USER'S FAVORITES ON SESSION
app.post('/api/favorites', userCtrl.addToFavorites);

// ADD STOCK TO USER'S WATCHLIST 
app.post('/api/watchlist', userCtrl.addToWatchlist);

// GET STOCKS FROM USER'S WATCHLIST
app.get('/api/user/:id/stocks', stocksCtrl.getUserWatchlist);



// STOCK DATA ENDPOINTS

// GET ALL STOCKS FROM DB
app.get('/api/stocks', stocksCtrl.getStocks);

// Used for pagination and InfiniteScroll in Tiles Component
app.get('/api/stocks/page/:page', stocksCtrl.getStocksPaginated);

// GET STOCKS FROM DEFINED SECTOR
app.get('/api/stocks/:sector', stocksCtrl.getStocksBySector);

// GET STOCKS PRICED LESS THAN FILTER VALUE
app.get('/api/stocks/price/:filter', stocksCtrl.filterByPrice);

// GET STOCKS WITH HIGHEST PERCENTAGE GAIN
app.get('/api/stocks/top/gainers', stocksCtrl.getTopGainers);

// GET STOCKS WITH HIGHEST PERCENTAGE LOSS
app.get('/api/stocks/top/losers', stocksCtrl.getTopLosers);

// GET STOCKS WITH HIGHEST VOLUME
app.get('/api/stocks/top/volume', stocksCtrl.getTopVolume);

// GET LIST OF SECTORS AND YTD PERCENT CHANGE
app.get('/api/stocks/sectors/change', (req, res, next) => {
  db.stocks.findAll({
    group: ['sector'],
    attributes: ['sector', [sequelize.fn('avg', sequelize.col('ytdchange')), 'AvgPercent']],

  })
    .then(sectors => res.status(200).send(sectors))
    .catch(err => res.status(500).send(err));
});

const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})


// Server port
const port = 3001;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
