const express = require('express');
const dashboardRouter = express.Router();
const database = require('../db-controller');
const authorization = require('../middleware/authorization');


dashboardRouter.get('/', authorization, async (request, response) => {
  try {
    //req.user already has the payload from the authorization middleware
    const user = await pool.query('SELECT user_name FROM users WHERE id = $1', [request.user.id])
    response.json(user.rows[0])

  } catch (error) {
    console.error(error.message);
    response.status(500).json('Server error.')
  }
});

module.exports = dashboardRouter