const express = require('express');
const productsRouter = express.Router();
const database = require('../db-controller');

// GET request for entire product database
productsRouter.get('/', database.getAll);

// GET request for single product by id
productsRouter.get('/:id', database.getItemById);

// POST request for adding a new product
productsRouter.post('/', database.createItem);

// DELETE request for deleting existing product
productsRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing product
productsRouter.put('/:id', database.updateItem);


module.exports = productsRouter;