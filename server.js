const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { v4 } = require('uuid');

const app = express();

// configure environment variables.
dotenv.config({ path: `${__dirname}/dev.env` })

// Secure app by setting various HTTP headers.
app.use(helmet());

// protects against HTTP Parameter Pollution attacks.
app.use(hpp());

// Like express.json() converts request body to JSON, also carries out some other functionalities like converting form-data to JSON.
// app.use(express.urlencoded({ extended: false }))

// Enable CORS for communication between back and front end.
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Built-in middleware JSON parser for incoming requests.
app.use(express.json());

// HTTP request logger middleware setup for development use.
app.use(morgan('dev'));




// Limit repeated requests to the API.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

app.get('/', (req, res) => {
  res.json({
    message: 'testing default route',
  });
});



app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

// Mount router for /api.
const apiRouter = require('./api/api');
app.use('/api', apiRouter);


// CSRF protection middleware.
// app.use(csurf());


module.exports = app ;
