const { validationResult } = require('express-validator');
const orderModel = require('../models/order.model');
const cartModel = require('../models/cart.model');
const { paginate, paginationResult } = require('../utils/pagination');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cart = await cartModel.getCartByUserId(req.user.id);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const { shipping_address, billing_address, payment_method, coupon_code } = req.body;
    
    const orderData = {
      user_id: req.user.id,
      order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      shipping_address,
      billing_address: billing_address || shipping_address,
      payment_method,
      coupon_code
    };
    
    const order = await orderModel.createOrder(orderData, cart.items);
    
    // Clear cart after order creation
    await cartModel.clearCart(cart.id);
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { orders, total } = await orderModel.getUserOrders(req.user.id, limit, offset);
    
    res.json(paginationResult(orders, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order or is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderModel.cancelOrder(req.params.id, req.user.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }
    
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  try {
    const order = await orderModel.confirmOrder(req.params.id);
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  confirmOrder
};