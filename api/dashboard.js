const express = require('express');
const dashboardRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

dashboardRouter.get('/', checkJwt, database.getUsernameById);

module.exports = dashboardRouter