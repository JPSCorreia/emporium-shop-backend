const dotenv = require('dotenv');
const express = require('express');
const session = require('cookie-session');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');


// Import and configure environment variables.
const inDevelopment = true;
const environmentFilename = (inDevelopment? 'set-env-variables-dev.env' : 'set-env-variables.env');
dotenv.config({ path: `${__dirname}/${environmentFilename}` })
module.exports = 
  environmentFilename
;

const passport = require('./middleware/passport');

const app = express();

// Secure app by setting various HTTP headers.
app.use(helmet());

// protects against HTTP Parameter Pollution attacks.
app.use(hpp());



// Like express.json() converts request body to JSON, also carries out some other functionalities like converting form-data to JSON.
// app.use(express.urlencoded({ extended: false }))

// Enable CORS for communication between back and front end.
app.use(cors());

// Built-in middleware JSON parser for incoming requests.
app.use(express.json());

// HTTP request logger middleware setup for development use.
app.use(morgan('dev'));

// Cookie settings.
app.use(
  session({
    name: 'session',
    secret: process.env.COOKIESECRET,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })
);

// CSRF protection middleware.
//  app.use(csurf());

// Limit repeated requests to the API.
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use(limiter);

// Use passport.js.
app.use(passport.initialize());

// Mount router for /api.
 const apiRouter = require('./api/api');
 app.use('/api', apiRouter);

const authRoutes = require('./api/auth');
app.use('/auth', authRoutes);

// Start server and listen on PORT:
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server started. Listening on ${process.env.PORT}:`)
})

module.exports = app;
