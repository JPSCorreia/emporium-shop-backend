const express = require('express');
const addressesRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// POST request for adding a new row
addressesRouter.post('/', checkJwt, database.createItem);

// GET request for all addresses belonging to a user
addressesRouter.get('/:email', checkJwt, database.getAddresses);

// DELETE request for deleting address belonging to a single user
addressesRouter.delete('/delete_address/:user_email/:id', checkJwt, database.deleteAddress);

// PUT request for updating row
addressesRouter.put('/:id', checkJwt, database.updateItem);


module.exports = addressesRouter;