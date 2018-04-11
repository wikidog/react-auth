const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.sign({
    sub: user.id,
    iat: timestamp,
  }, config.secret);
}

module.exports = {

  index(req, res, next) {
    res.send('sign up');
  },

  signin(req, res, next) {
    // username and password auth'd
    // we just need to give them a token
    //
    // we can access the user object through req.user (this is done by Passport)
    //
    res.json({ token: tokenForUser(req.user) });

  },

  signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // do simple validation before hitting the database related functions
    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password' });
    }

    // 1. check if a user with the given email exists
    User.findOne({ email: email })
      .then(user => {

        if (user) {

          // 2. if a user with email does exist, return an error
          return res.status(422).send({ error: 'Email is in use' });
        }

        // 3. if a user with email does NOT exist, create and save user record
        user = new User({
          email: email,
          password: password,
        });

        user.save()
          .then(() => {

            // 4. respond to request indicating the user was created
            res.json({ token: tokenForUser(user) });
          })
          .catch(next);  // let the error handling function run

      })
      .catch(next);  // let the error handling function run
                     // this is database error; we won't get
                     //   this error if no record found
  }
};
