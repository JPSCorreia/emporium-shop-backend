const express = require('express');
const productsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire products table
productsRouter.get('/', database.getAll);

// GET request for single product by id
productsRouter.get('/:id', database.getItemById);

// POST request for adding a new product
productsRouter.post('/', checkJwt, database.createItem);

// DELETE request for deleting existing product
productsRouter.delete('/:id', checkJwt, database.deleteItem);

// UPDATE request for updating existing product stock
productsRouter.put('/', checkJwt, database.removeStock);


module.exports = productsRouter;