const express = require('express');
const usersRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire users table
usersRouter.get('/', database.getAll);

// GET request for single user by username
usersRouter.get('/:username', database.getUserByUsername);

// POST request for adding a new user
usersRouter.post('/', checkJwt, database.createItem);

// DELETE request for deleting existing user
usersRouter.delete('/:id', checkJwt, database.deleteItem);

// UPDATE request for updating existing user
usersRouter.put('/:id', checkJwt, database.updateItem);

// GET request for getting user register date
usersRouter.get('/get_date/:email', checkJwt, database.getMonthAndYear);



module.exports = usersRouter;

