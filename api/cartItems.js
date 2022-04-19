const express = require('express');
const cartItemsRouter = express.Router();
const database = require('../db-controller');

// GET request for entire database
cartItemsRouter.get('/', database.getAll);

// GET request for a single row
cartItemsRouter.get('/:id', database.getItemById);

// POST request for adding a new row
cartItemsRouter.post('/', database.createItem);

// DELETE request for deleting existing row
cartItemsRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing row
cartItemsRouter.put('/:id', database.updateItem);


module.exports = cartItemsRouter;