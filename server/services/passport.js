const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

// Passport includes many different strategies
// we are using Jwt strategy here for Jwt token authentication
//              Local strategy for username and password authentication

// Create local strategy
//
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this username and password, call done with the user object
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return done(null, false);  // didn't find the user
      }

      // compare passwords - is 'password' equal to user.password
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err, false);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);  // passport will assign this user object
                                  // to req.user
      });
    })
    .catch(err => done(err, false));  // db error
});

// setup options for JWT Strategy
// tell JWT strategy where to find the token
//   and secret so that the token can be decoded
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

  // payload: decoded JWT token
  // done: a callback function we need to call after our logic
  //
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user object
  // otherwise, call done without a user object
  User.findById(payload.sub)
    .then(user => {
      if (user) {
        done(null, user);   // pass the user object to done() function
      } else {
        done(null, false);  // didn't find the user
      }
    })
    .catch(err => done(err, false));  // db error
});

// -------------------------------------------------------------------

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

