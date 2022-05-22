const express = require('express');
const cartsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire carts table
cartsRouter.get('/', checkJwt, database.getAll);

// GET request for a single row
cartsRouter.get('/:id', checkJwt, database.getItemById);

// POST request for adding a new row
cartsRouter.post('/', checkJwt, database.createItem);

// DELETE request for deleting existing row
cartsRouter.delete('/:id', checkJwt, database.deleteItem);

// UPDATE request for updating existing row
cartsRouter.put('/:id', checkJwt, database.updateItem);


module.exports = cartsRouter;