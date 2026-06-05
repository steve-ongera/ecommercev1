const db = require('../config/db');
const userModel = require('../models/user.model');
const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');
const { paginate, paginationResult } = require('../utils/pagination');

const getDashboardStats = async (req, res, next) => {
  try {
    // Total revenue
    const revenueResult = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'"
    );
    
    // Total orders
    const ordersResult = await db.query('SELECT COUNT(*) FROM orders');
    
    // Total customers
    const customersResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'user'");
    
    // Total products
    const productsResult = await db.query('SELECT COUNT(*) FROM products');
    
    // Recent orders
    const recentOrders = await db.query(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    );
    
    res.json({
      success: true,
      stats: {
        totalRevenue: parseFloat(revenueResult.rows[0].total),
        totalOrders: parseInt(ordersResult.rows[0].count),
        totalCustomers: parseInt(customersResult.rows[0].count),
        totalProducts: parseInt(productsResult.rows[0].count)
      },
      recentOrders: recentOrders.rows
    });
  } catch (error) {
    next(error);
  }
};

const getSalesChart = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const result = await db.query(
      `SELECT DATE(created_at) as date, 
              COUNT(*) as orders, 
              COALESCE(SUM(total_amount), 0) as revenue
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const { status, startDate, endDate } = req.query;
    
    let query = `
      SELECT o.*, u.name as user_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND o.status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (startDate) {
      query += ` AND o.created_at >= $${paramIndex++}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND o.created_at <= $${paramIndex++}`;
      params.push(endDate);
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    const countQuery = `
      SELECT COUNT(*) FROM orders o WHERE 1=1
      ${status ? ` AND status = $1` : ''}
    `;
    const countResult = await db.query(countQuery, status ? [status] : []);
    
    res.json(paginationResult(result.rows, parseInt(countResult.rows[0].count), req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderModel.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const products = await productModel.getLowStockProducts(threshold);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { limit, offset } = paginate(req.query.page, req.query.limit);
    const users = await userModel.getAllUsers(limit, offset);
    const total = await userModel.countUsers();
    
    res.json(paginationResult(users, total, req.query.page || 1, limit));
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getSalesReport = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    let interval;
    
    switch(period) {
      case 'week': interval = '7 days'; break;
      case 'month': interval = '30 days'; break;
      case 'year': interval = '365 days'; break;
      default: interval = '30 days';
    }
    
    const result = await db.query(
      `SELECT DATE(created_at) as date, 
              COUNT(*) as order_count,
              SUM(total_amount) as total_sales,
              AVG(total_amount) as average_order_value
       FROM orders 
       WHERE created_at >= NOW() - INTERVAL '${interval}'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );
    
    res.json({ success: true, report: result.rows });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await db.query(
      `SELECT p.id, p.name, p.price, 
              COUNT(oi.id) as order_count,
              SUM(oi.quantity) as total_sold,
              SUM(oi.total_price) as total_revenue
       FROM products p
       JOIN order_items oi ON p.id = oi.product_id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.status != 'cancelled'
       GROUP BY p.id, p.name, p.price
       ORDER BY total_sold DESC
       LIMIT $1`,
      [limit]
    );
    
    res.json({ success: true, products: result.rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getSalesChart,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getLowStockProducts,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSalesReport,
  getTopProducts
};