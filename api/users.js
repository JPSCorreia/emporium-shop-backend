const express = require('express');
const usersRouter = express.Router();
const database = require('../db-controller');

// GET request for entire user database
usersRouter.get('/', database.getAll);

// GET request for a single user
// usersRouter.get('/:id', database.getItemById);

// POST request for adding a new user
usersRouter.post('/', database.createItem);

// DELETE request for deleting existing user
usersRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing user
usersRouter.put('/:id', database.updateItem);

// GET request for single user by username
usersRouter.get('/:username', database.getUserByUsername);


module.exports = usersRouter;

