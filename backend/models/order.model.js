const db = require('../config/db');
const couponModel = require('./coupon.model');

const createOrder = async (orderData, cartItems) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Calculate totals
    let subtotal = 0;
    for (const item of cartItems) {
      subtotal += item.price * item.quantity;
    }
    
    let discountAmount = 0;
    if (orderData.coupon_code) {
      const coupon = await couponModel.validateCoupon(orderData.coupon_code, subtotal);
      if (coupon) {
        discountAmount = coupon.discount_type === 'percentage' 
          ? (subtotal * coupon.discount_value / 100)
          : coupon.discount_value;
        if (coupon.maximum_discount && discountAmount > coupon.maximum_discount) {
          discountAmount = coupon.maximum_discount;
        }
        await couponModel.incrementCouponUsage(coupon.id);
      }
    }
    
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingAmount = subtotal > 50 ? 0 : 10;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    
    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, status, subtotal, tax_amount, 
        shipping_amount, discount_amount, total_amount, shipping_address, 
        billing_address, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        orderData.user_id,
        orderData.order_number,
        'pending',
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        JSON.stringify(orderData.shipping_address),
        JSON.stringify(orderData.billing_address),
        orderData.payment_method
      ]
    );
    
    const order = orderResult.rows[0];
    
    // Create order items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, 
          quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          item.product_id,
          item.name,
          item.image,
          item.quantity,
          item.price,
          item.price * item.quantity
        ]
      );
      
      // Update product stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getUserOrders = async (userId, limit = 20, offset = 0) => {
  const query = `
    SELECT o.*, 
           COUNT(oi.id) as item_count,
           SUM(oi.quantity) as total_items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [userId, limit, offset]);
  
  const countQuery = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
  const countResult = await db.query(countQuery, [userId]);
  
  return {
    orders: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const getOrderById = async (orderId) => {
  const orderResult = await db.query(
    `SELECT o.*, u.name as user_name, u.email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = $1`,
    [orderId]
  );
  
  if (orderResult.rows.length === 0) return null;
  
  const order = orderResult.rows[0];
  
  const itemsResult = await db.query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );
  
  order.items = itemsResult.rows;
  return order;
};

const cancelOrder = async (orderId, userId) => {
  const result = await db.query(
    `UPDATE orders 
     SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND status IN ('pending', 'processing')
     RETURNING *`,
    [orderId, userId]
  );
  return result.rows[0];
};

const updateOrderStatus = async (orderId, status) => {
  const result = await db.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0];
};

const confirmOrder = async (orderId) => {
  const result = await db.query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    ['confirmed', orderId]
  );
  return result.rows[0];
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
  const result = await db.query(
    'UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [paymentStatus, orderId]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  confirmOrder,
  updatePaymentStatus
};