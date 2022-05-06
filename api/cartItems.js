const express = require('express');
const cartItemsRouter = express.Router();
const database = require('../db-controller');

// GET request for entire database
cartItemsRouter.get('/', database.getAll);

// GET request for a single row
// cartItemsRouter.get('/:id', database.getItemById);

// POST request for adding a new row
cartItemsRouter.post('/', database.createItem);

// DELETE request for deleting existing row
cartItemsRouter.delete('/:id', database.deleteProductByProductId);

// UPDATE request for updating existing row
// cartItemsRouter.put('/:id', database.updateItem);

// GET request for of single row by Email
cartItemsRouter.get('/get_cart/:email/:products_id', database.getCartByEmail);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/', database.removeStockAddQuantity);

// PUT request to update quantity of product by user email product id
cartItemsRouter.put('/remove_quantity', database.removeQuantityAddStock);

// GET request for all cart items belonging to a user
cartItemsRouter.get('/:email', database.getCart);

// GET request for all cart items belonging to a user
cartItemsRouter.get('/total_price/:email', database.getTotalPrice);

// GET request for all products in cart belonging to a user
cartItemsRouter.get('/cart_products/:email', database.getCartProducts);

// GET request for number of cart items belonging to a user
cartItemsRouter.get('/total_number/:email', database.getItemTotal);

module.exports = cartItemsRouter;