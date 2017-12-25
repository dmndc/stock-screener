const Auth0Strategy = require('passport-auth0');
require('dotenv').config();
const { AUTH_DOMAIN, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET} = process.env;



module.exports = new Auth0Strategy({
  domain:       AUTH_DOMAIN,
  clientID:     AUTH_CLIENT_ID,
  clientSecret: AUTH_CLIENT_SECRET,
  callbackURL:  '/login'
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
);