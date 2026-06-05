const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes
router.use(authMiddleware);

router.post(
  '/',
  [
    body('product_id').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional()
  ],
  reviewController.createReview
);

router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.post('/:id/helpful', reviewController.markHelpful);

module.exports = router;