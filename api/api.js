const express = require('express');
const apiRouter = express.Router();

// Mount router for /products
const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

// Mount router for /users
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// Mount router for /orders
const ordersRouter = require('./orders');
apiRouter.use('/orders', ordersRouter);

// Mount router for /carts
const cartsRouter = require('./carts');
apiRouter.use('/carts', cartsRouter);

// Mount router for /order_items
const orderItemsRouter = require('./orderItems');
apiRouter.use('/orderItems', orderItemsRouter);

// Mount router for /orders
const cartItemsRouter = require('./cartItems');
apiRouter.use('/cartItems', cartItemsRouter);

// Mount router for /dashboard
const dashboardRouter = require('./dashboard');
apiRouter.use('/dashboard', dashboardRouter);

module.exports = apiRouter;