// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router');

const app = express();

// DB setup
mongoose.connect('mongodb://localhost:27017/auth')
  .then(() => console.log('Database connected...'))
  .catch(e => console.log('Database connection error: ', e));

// App Setup
//
// these are middlewares; must be called before our application
//
// morgan: HTTP request logger middleware
//         'combined': standard Apache combined log output
app.use(morgan('combined'));
//
// allow CORS requests
//
app.use(cors());
//
// body-parser: parse request bodies, available under the req.body property
//              json({type: '*/*'}) - parse as JSON for any request
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// error handling middleware - catch all the errors here
//
app.use((err, req, res, next) => {
  console.log('*** error handling middleware ***', err);
  res.status(422).send({ error: err.message });
})

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server running at http://localhost:${port}/`);

