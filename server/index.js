const express = require('express');
const session = require('express-session');
const { json } = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const strategy = require('./auth/strategy');
const axios = require('axios');


const Auth0Strategy = require('passport-auth0');
const { AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET} = process.env;

// Sequelize.js
const Sequelize = require('sequelize');
const db = require('./config/db');

require('dotenv').config();

// Middleware
const checkForSession = require('./middlewares/checkForSession');

// Controllers
// const authCtrl = require('./controllers/authCtrl');
 


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


// 


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
      domain:       AUTH_DOMAIN,
      clientID:     AUTH_CLIENT_ID,
      clientSecret: AUTH_CLIENT_SECRET,
      callbackURL:  '/login'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      console.log('AAAA', profile);

      getUserByAuthId(profile._json.user_id)
        .then( res => {

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

passport.serializeUser(function(user, done) {
  done(null, user);  
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/login', 
  passport.authenticate('auth0',
    { successRedirect: 'http://localhost:3000/', failureRedirect: '/login', failureFlash: true }
  )
)

app.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("http://localhost:3000/");
});

app.get("/api/logstatus", (req, res, next) => {
  res.status(200).json(req.session);
});

app.post('/api/favorites', (req, res, next)=>{
  let stock = req.body.stock;
   if(!req.session.favorites ){
     req.session.favorites = [];
   }
   req.session.favorites.push(stock); //add item to favorites
   return res.json(req.session.favorites);
  })
 

app.get('/me', ( req, res, next) => {
  if ( !req.user ) {
    res.redirect('/login');
  } else {
    req.user === req.session.passport.user
    // console.log( req.user )
    // console.log( req.session.passport.user );


    res.status(200).send(JSON.stringify(req.user, null, 10));
  }
});

app.get('/api/user', (req, res, next) => {
  if ( !req.user ) {
    res.redirect('/login');
  } else {
    req.user === req.session.passport.user
    let auth_id = req.user.id;
    
    getUserByAuthId(auth_id)
      .then( user => {
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


// Get the array of all stocks from the DB
const getStocksFromDb = () => {
  return db.stocks.findAll({
    limit: 505, 
    raw: true, 
    order: [ ['symbol', 'ASC'] ]
  })
}

const filterBySector = (sector) => {
  return db.stocks.findAll({
    where: { sector: sector },
    order: [ ['symbol', 'ASC'] ],
    raw: true 
  })
}

const filterByPrice = (priceOperator) => {
  return db.stocks.findAll({
    where: { priceOperator },
    order: [ ['symbol', 'ASC'] ],
    raw: true 
  })
}

const getUserById = (id) => {
  return db.users.findOne({
    where: { id: id }
  })
}

const getUserByAuthId = (AuthId) => {
  return db.users.findOne({
    where: { auth_id: AuthId }
  })
}

const createUserByAuthId = (authId, email) => {
  return db.users.create({
    auth_id: authId,
    email: email
  })
}

const getUsers = () => {
  return db.users.findAll({ 
    raw: true, 
    order: [ ['username', 'ASC'] ]
  })
}

// Endpoints

app.get('/api/user/:id', (req, res, next) => {
  let id = req.params.id;

  getUserById(id)
    .then(user => res.status(200).send(user))
    .catch(err => res.status(500).send(err));
})

app.get('/api/users', (req, res, next) => {
  getUsers()
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send(err));
})

app.get('/', (req, res, next) => {
  let sessData = req.session;
  console.log('LEts see.. ');
  res.send(sessData);
})

app.get('/api/stocks', (req, res, next) => {

  getStocksFromDb()
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));

})

app.get('/api/stocks/:sector', (req, res, next) => {
  filterBySector(req.params.sector)
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));    
})

app.get('/api/stocks/pricefilter', (req, res, next) => {
  filterByPrice(req.params.filter)
    .then(stocks => res.status(200).send(stocks))
    .catch(err => res.status(500).send(err));    
})


app.post('/user/add', (req, res, next) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  db.users.create({
    username: username,
    password: password,
    email: email
  })
  .then(newUser => {
    res.json(newUser);
  })
  .catch(err => console.log(err) );

});

app.post('/api/watchlist', (req, res, next) => {
  const user = req.body.user;
  const symbol = req.body.symbol;

  let id = db.stocks.findOne({
    where: { symbol: symbol}
  }).then( res => {
      console.log('ID: ', res.id);

      db.userstocks.create({
        user_id: user,
        stock_id: res.id
      })
    }
  )

  // db.userstocks.findAll({raw: true})
  //   .then( res => {
  //    console.log(res);
  //     // res.status(200).send(res);
  //   })

    // return db.users.findAll({ 
    //   raw: true, 
    //   order: [ ['username', 'ASC'] ]
    // })

  // db.users.addStocks();

  // res.status(200).send(list);

})

// Used for pagination and InfiniteScroll in Tiles Component
app.get('/api/stocks/:page', (req, res, next) => {
  let limit = 20;
  let offset = 0;

  db.stocks.findAndCountAll()
    .then( (data) => {
      let page = req.params.page; // page number
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);

      db.stocks.findAll({
        limit: limit,
        offset: offset,
        order: ['company']
        // $sort: { symbol: 1}
      })
      .then( (stocks) => {
        res.status(200).json({'stocks': stocks, 'count': data.count, 'pages': pages});
      });
    })
    .catch(function (error) {
      res.status(500).send('Internal Server Error');
    });
  });
  


// Sequelize associations

app.get('/api/sequelize/', (req, res) => {
  db.users.findAll({
    include: [ 
      {
        model: db.stocks        
      } 
    ]
  })
  .then(users => {
    res.json(users);
    // console.log(users);
    // const resObj = users;
    // res.json(resObj);
  });
});

app.get('/api/user/:id/stocks', (req, res, next) => {
  let id = req.params.id;
  db.users.findOne({
    where: { id: id },
    include: [
      {
        model: db.stocks
      }
    ]
  })
  .then( user => {
    res.json(user.stocks);
  })
})

app.get('/api/top/gainers', (req, res, next) => {
  db.stocks.findAll({
    limit: 5,
    order: [ ['changePercent', 'DESC'] ],
    attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice']
  })
    .then( stocks => {
      res.json(stocks)
    })
})

app.get('/api/top/losers', (req, res, next) => {
  db.stocks.findAll({
    limit: 5,
    order: [ ['changePercent', 'ASC'] ],
    attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice']
  })
    .then( stocks => {
      res.json(stocks)
    })
})

app.get('/api/top/volume', (req, res, next) => {
  db.stocks.findAll({
    limit: 5,
    order: [ ['latestVolume', 'DESC'] ],
    attributes: ['id', 'symbol', 'companyName', 'sector', 'changePercent', 'latestPrice', 'latestVolume']
  })
    .then( stocks => {
      res.json(stocks)
    })
})

app.get('/api/sectors', (req, res, next) => {
  db.stocks.findAll({
    group: ['sector'],
    attributes: ['sector', [sequelize.fn('avg', sequelize.col('ytdchange')), 'AvgPercent' ] ],
    
  })
    .then( items => {
      res.json(items);
    })
})


// Server port
const port = 3001;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
