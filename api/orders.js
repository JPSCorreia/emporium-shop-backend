const express = require('express');
const ordersRouter = express.Router();
const database = require('../db-controller');

// GET request for entire orders table
ordersRouter.get('/get_all/:email', database.getAllOrders);

// GET request for a single order
ordersRouter.get('/:id', database.getItemById);

// GET request for all items from order
ordersRouter.get('/order_products/:id', database.getAllOrderItems);

// POST request for adding a new order
ordersRouter.post('/', database.createItem);

// DELETE request for deleting existing order
ordersRouter.delete('/:id', database.deleteItem);

// UPDATE request for updating existing order
ordersRouter.put('/:id', database.updateItem);

// GET request for number of orders
ordersRouter.get('/get_number/:email', database.getNumberOfOrders);

module.exports = ordersRouter;