const express = require('express');
const { body } = require('express-validator');
const couponController = require('../controllers/coupon.controller');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Public routes
router.post('/validate', couponController.validateCoupon);

// Protected routes
router.use(authMiddleware);

// Admin only routes
router.get('/', isAdmin, couponController.getCoupons);
router.post(
  '/',
  isAdmin,
  [
    body('code').notEmpty(),
    body('discount_type').isIn(['percentage', 'fixed']),
    body('discount_value').isFloat({ min: 0 }),
    body('valid_from').isISO8601(),
    body('valid_until').isISO8601()
  ],
  couponController.createCoupon
);

router.put('/:id', isAdmin, couponController.updateCoupon);
router.delete('/:id', isAdmin, couponController.deleteCoupon);

module.exports = router;