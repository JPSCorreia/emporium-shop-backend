const express = require('express');
const productsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire products table
productsRouter.get('/', database.getAll);

// GET request for single product by id
productsRouter.get('/:id', database.getItemById);

// POST request for adding a new product
productsRouter.post('/', database.createItem);

// DELETE request for deleting existing product
productsRouter.delete('/:id', database.deleteItem);

// UPDATE request for removing existing product stock
productsRouter.put('/', database.removeStock);

// UPDATE request for adding existing product stock
productsRouter.put('/add_stock', database.addStock);


module.exports = productsRouter;