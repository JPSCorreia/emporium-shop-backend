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

// UPDATE request for removing existing product stock
productsRouter.put('/', checkJwt, database.removeStock);

// UPDATE request for adding existing product stock
productsRouter.put('/add_stock', checkJwt, database.addStock);

// GET request for products page
productsRouter.get('/page/:page', checkJwt, database.getProductPage);

// GET request for total number of products
productsRouter.get('/total/get_number', checkJwt, database.getNumberOfProducts);

// GET request for searching for products
productsRouter.post('/search_products/search', checkJwt, database.getSearchResults);


module.exports = productsRouter;