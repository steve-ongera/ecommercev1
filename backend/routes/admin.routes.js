const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.use(authMiddleware);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/sales-chart', adminController.getSalesChart);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Products management
router.get('/products/low-stock', adminController.getLowStockProducts);

// Users management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Reports
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/top-products', adminController.getTopProducts);

module.exports = router;