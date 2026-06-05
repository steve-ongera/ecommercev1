const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/create-payment-intent',
  [
    body('order_id').notEmpty()
  ],
  paymentController.createPaymentIntent
);

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);
router.get('/order/:orderId', paymentController.getPaymentStatus);
router.post('/:paymentId/refund', paymentController.refundPayment);

module.exports = router;