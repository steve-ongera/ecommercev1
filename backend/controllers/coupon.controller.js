const { validationResult } = require('express-validator');
const couponModel = require('../models/coupon.model');
const { paginate, paginationResult } = require('../utils/pagination');

const getCoupons = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { coupons, total } = await couponModel.getAllCoupons(limit, offset);
    res.json(paginationResult(coupons, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    
    const coupon = await couponModel.validateCoupon(code, orderAmount);
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
    
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const couponData = req.body;
    const coupon = await couponModel.createCoupon(couponData);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const coupon = await couponModel.updateCoupon(id, updates);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await couponModel.deleteCoupon(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
};