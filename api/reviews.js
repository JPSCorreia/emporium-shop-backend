const express = require('express');
const reviewsRouter = express.Router();
const database = require('../db-controller');
const checkJwt = require('../middleware/authorization')

// GET request for single review by id
reviewsRouter.get('/:id', checkJwt, database.getReviewByProductId);

// POST request for new review.
reviewsRouter.post('/', checkJwt, database.createItem);

// PUT request for updating row
reviewsRouter.put('/:id', checkJwt, database.updateItem);

// GET request for single review by id
reviewsRouter.get('/get_review/:user_email/:id', checkJwt, database.getReviewByUserAndId)


module.exports = reviewsRouter;