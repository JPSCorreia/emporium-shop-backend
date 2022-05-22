const express = require('express');
const cartItemsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire cart_items table
cartItemsRouter.get('/', checkJwt, database.getAll);

// GET request for all cart items belonging to a user
cartItemsRouter.get('/:email', checkJwt, database.getCart);

// GET request for of single row by Email
cartItemsRouter.get('/get_cart/:email/:products_id', checkJwt, database.getCartByEmail);

// GET request for price of all cart items belonging to a user
cartItemsRouter.get('/total_price/:email', checkJwt, database.getTotalPrice);

// GET request for all products in cart belonging to a user
cartItemsRouter.get('/cart_products/:email', checkJwt, database.getCartProducts);

// GET request for number of cart items belonging to a user
cartItemsRouter.get('/total_number/:email', checkJwt, database.getItemTotal);

// POST request for adding a new row
cartItemsRouter.post('/', checkJwt, database.createItem);

// DELETE request for deleting existing row
// cartItemsRouter.delete('/:id', database.deleteProductByProductId);

// DELETE request for deleting existing row
cartItemsRouter.delete('/delete_item/:user_email/:products_id', checkJwt, database.deleteCartItem);

// DELETE request for deleting all cart items belonging to a single user
cartItemsRouter.delete('/delete_cart/:email', database.deleteAllFromCart);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/', checkJwt, database.addQuantity);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/remove_quantity', checkJwt, database.removeQuantity);

module.exports = cartItemsRouter;