const { validationResult } = require('express-validator');
const cartModel = require('../models/cart.model');

const getCart = async (req, res, next) => {
  try {
    let cart = await cartModel.getCartByUserId(req.user.id);
    
    if (!cart) {
      cart = await cartModel.createCart(req.user.id);
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, quantity } = req.body;
    
    let cart = await cartModel.getCartByUserId(req.user.id);
    if (!cart) {
      cart = await cartModel.createCart(req.user.id);
    }
    
    const cartItem = await cartModel.addToCart(cart.id, product_id, quantity);
    res.status(201).json({ success: true, cartItem });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    const cartItem = await cartModel.updateCartItem(itemId, quantity);
    res.json({ success: true, cartItem });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await cartModel.removeFromCart(itemId);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartModel.getCartByUserId(req.user.id);
    if (cart) {
      await cartModel.clearCart(cart.id);
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

const mergeCart = async (req, res, next) => {
  try {
    const { sessionCart } = req.body;
    const cart = await cartModel.mergeCart(req.user.id, sessionCart);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
};