const express = require('express');
const orderItemsRouter = express.Router();
const database = require('../db-controller');

// GET request for entire database
orderItemsRouter.get('/', database.getAll);

// GET request for a single row
orderItemsRouter.get('/:id', database.getItemById);

// POST request for adding a new row
orderItemsRouter.post('/', database.createItem);

// DELETE request for deleting existing row
orderItemsRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing row
orderItemsRouter.put('/:id', database.updateItem);


module.exports = orderItemsRouter;