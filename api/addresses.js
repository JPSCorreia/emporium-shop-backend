const express = require('express');
const addressesRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// POST request for adding a new row
addressesRouter.post('/', checkJwt, database.createItem);

module.exports = addressesRouter;