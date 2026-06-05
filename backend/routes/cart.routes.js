const express = require('express');
const { body } = require('express-validator');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post(
  '/items',
  [
    body('product_id').notEmpty(),
    body('quantity').isInt({ min: 1 })
  ],
  cartController.addToCart
);

router.put('/items/:itemId', [
  body('quantity').isInt({ min: 1 })
], cartController.updateCartItem);

router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.post('/merge', cartController.mergeCart);

module.exports = router;