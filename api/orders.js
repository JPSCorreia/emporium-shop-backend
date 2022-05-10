const express = require('express');
const ordersRouter = express.Router();
const database = require('../db-controller');

// GET request for entire orders table
ordersRouter.get('/', database.getAll);

// GET request for a single order
ordersRouter.get('/:id', database.getItemById);

// POST request for adding a new order
ordersRouter.post('/', database.createItem);

// DELETE request for deleting existing order
ordersRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing order
ordersRouter.put('/:id', database.updateItem);


module.exports = ordersRouter;