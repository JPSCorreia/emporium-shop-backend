const express = require('express');
const orderItemsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire order_items table
orderItemsRouter.get('/', checkJwt, database.getAll);

// GET request for a single row
orderItemsRouter.get('/:id', checkJwt, database.getItemById);

// POST request for adding a new row
orderItemsRouter.post('/', checkJwt, database.addOrderItems);

// DELETE request for deleting existing row
orderItemsRouter.delete('/:id', checkJwt, database.deleteItem);

// UPDATE request for updating existing row
orderItemsRouter.put('/:id', checkJwt, database.updateItem);


module.exports = orderItemsRouter;