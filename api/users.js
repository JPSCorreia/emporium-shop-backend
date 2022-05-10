const express = require('express');
const usersRouter = express.Router();
const database = require('../db-controller');

// GET request for entire users table
usersRouter.get('/', database.getAll);

// GET request for single user by username
usersRouter.get('/:username', database.getUserByUsername);

// POST request for adding a new user
usersRouter.post('/', database.createItem);

// DELETE request for deleting existing user
usersRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing user
usersRouter.put('/:id', database.updateItem);

module.exports = usersRouter;

