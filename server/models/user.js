const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// define model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    // mongodb is case-sensitive; always change string to lower case
    lowercase: true,
    required: [true, 'Email is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
});

// mongoose middleware
//
// On Save Hook, hash the password before is is saved to the db
userSchema.pre('save', function(next) {
  const user = this;  // the context is the user model instance

  // check to see if password is modified
  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {

      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {

        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });

  } else {
    next();
  }
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  const user = this;  // the context is the user model instance
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

// create the model class
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
