const Authentication = require('./controllers/authentication');

const passport = require('passport');

// require() function will run password.use() functions
//
// Note: this will only be called once when node starts;
//       this most likely won't be called for every request.
//
const passportService = require('./services/passport');

// by default, passport tries to use session based authentication
// we have to disable it - don't create session after successful authentication
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {

  //
  // we use middlewares to protect the routes
  //   requireAuth
  //   requireSignin
  //

  app.get('/', requireAuth, (req, res) => {
    res.send({ message: 'secret code 123456' });
  });

  app.get('/users', Authentication.index);

  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);

};
