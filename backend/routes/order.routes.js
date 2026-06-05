const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('shipping_address').notEmpty(),
    body('payment_method').notEmpty()
  ],
  orderController.createOrder
);

router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);
router.post('/:id/confirm', orderController.confirmOrder);

module.exports = router;