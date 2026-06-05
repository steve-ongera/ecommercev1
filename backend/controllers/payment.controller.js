const Stripe = require('stripe');
const paymentModel = require('../models/payment.model');
const orderModel = require('../models/order.model');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    
    const order = await orderModel.getOrderById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100),
      currency: 'usd',
      metadata: {
        order_id: order.id,
        order_number: order.order_number
      }
    });
    
    await paymentModel.createPayment({
      order_id: order.id,
      payment_method: 'stripe',
      amount: order.total_amount,
      transaction_id: paymentIntent.id,
      payment_details: { client_secret: paymentIntent.client_secret }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    next(error);
  }
};

const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await paymentModel.updatePaymentStatus(
        paymentIntent.id,
        'completed'
      );
      await orderModel.updatePaymentStatus(
        paymentIntent.metadata.order_id,
        'paid'
      );
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await paymentModel.updatePaymentStatus(
        failedPayment.id,
        'failed'
      );
      break;
  }
  
  res.json({ received: true });
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentModel.getPaymentByOrderId(orderId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

const refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentModel.getPaymentById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const refund = await stripe.refunds.create({
      payment_intent: payment.transaction_id
    });
    
    await paymentModel.updatePaymentStatus(paymentId, 'refunded');
    
    res.json({ success: true, refund });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  stripeWebhook,
  getPaymentStatus,
  refundPayment
};