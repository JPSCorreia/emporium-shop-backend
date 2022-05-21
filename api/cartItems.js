const express = require('express');
const cartItemsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for entire cart_items table
cartItemsRouter.get('/', database.getAll);

// GET request for all cart items belonging to a user
cartItemsRouter.get('/:email', database.getCart);

// GET request for of single row by Email
cartItemsRouter.get('/get_cart/:email/:products_id', database.getCartByEmail);

// GET request for price of all cart items belonging to a user
cartItemsRouter.get('/total_price/:email', database.getTotalPrice);

// GET request for all products in cart belonging to a user
cartItemsRouter.get('/cart_products/:email', database.getCartProducts);

// GET request for number of cart items belonging to a user
cartItemsRouter.get('/total_number/:email', database.getItemTotal);

// POST request for adding a new row
cartItemsRouter.post('/', database.createItem);

// DELETE request for deleting existing row
// cartItemsRouter.delete('/:id', database.deleteProductByProductId);

// DELETE request for deleting existing row
cartItemsRouter.delete('/:user_email/:products_id', database.deleteCartItem);

// DELETE request for deleting all cart items belonging to a single user
// cartItemsRouter.delete('/delete_cart/:email', database.deleteAllFromCart);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/', database.addQuantity);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/remove_quantity', database.removeQuantity);

module.exports = cartItemsRouter;