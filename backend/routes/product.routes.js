const express = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);

// Admin only routes
router.post(
  '/',
  authMiddleware,
  isAdmin,
  upload.array('images', 5),
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 })
  ],
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  isAdmin,
  upload.array('images', 5),
  productController.updateProduct
);

router.delete('/:id', authMiddleware, isAdmin, productController.deleteProduct);
router.patch('/:id/stock', authMiddleware, isAdmin, productController.updateStock);

module.exports = router;