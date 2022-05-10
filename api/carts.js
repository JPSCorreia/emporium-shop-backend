const express = require('express');
const cartsRouter = express.Router();
const database = require('../db-controller');

// GET request for entire carts table
cartsRouter.get('/', database.getAll);

// GET request for a single row
cartsRouter.get('/:id', database.getItemById);

// POST request for adding a new row
cartsRouter.post('/', database.createItem);

// DELETE request for deleting existing row
cartsRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing row
cartsRouter.put('/:id', database.updateItem);


module.exports = cartsRouter;