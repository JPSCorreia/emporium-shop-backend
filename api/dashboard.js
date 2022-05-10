const express = require('express');
const dashboardRouter = express.Router();
const database = require('../db-controller');
// const authorization = require('../middleware/authorization');

dashboardRouter.get('/', database.getUsernameById);

module.exports = dashboardRouter