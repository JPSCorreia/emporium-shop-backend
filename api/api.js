const express = require('express');
const apiRouter = express.Router();
const checkJwt = require('../middleware/authorization')

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
apiRouter.use('/order_items', orderItemsRouter);

// Mount router for /orders
const cartItemsRouter = require('./cartItems');
apiRouter.use('/cart_items', cartItemsRouter);

// Mount router for /dashboard
const dashboardRouter = require('./dashboard');
apiRouter.use('/dashboard', dashboardRouter);

// Mount router for /addresses
const addressesRouter = require('./addresses');
apiRouter.use('/addresses', addressesRouter);

module.exports = apiRouter;