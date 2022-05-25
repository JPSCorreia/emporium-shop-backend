const express = require('express');
const ordersRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire orders table
ordersRouter.get('/get_all/:email', checkJwt, database.getAllOrders);

// GET request for a single order
ordersRouter.get('/:id', checkJwt, database.getItemById);

// GET request for all items from order
ordersRouter.get('/order_products/:id', checkJwt, database.getAllOrderItems);

// POST request for adding a new order
ordersRouter.post('/', checkJwt, database.createItem);

// DELETE request for deleting existing order
ordersRouter.delete('/:id', checkJwt, database.deleteItem);

// UPDATE request for updating existing order
ordersRouter.put('/:id', checkJwt, database.updateItem);

// GET request for number of orders
ordersRouter.get('/get_number/:email', checkJwt, database.getNumberOfOrders);

// GET request for getting order made date
ordersRouter.get('/get_date/:email', checkJwt, database.getOrderMonthAndYear);

module.exports = ordersRouter;