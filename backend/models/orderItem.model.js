const db = require('../config/db');

const createOrderItem = async (orderItemData) => {
  const { order_id, product_id, product_name, product_image, quantity, unit_price, total_price } = orderItemData;
  
  const result = await db.query(
    `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [order_id, product_id, product_name, product_image, quantity, unit_price, total_price]
  );
  return result.rows[0];
};

const getOrderItemsByOrderId = async (orderId) => {
  const result = await db.query(
    `SELECT oi.*, p.slug, p.images as product_images
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1
     ORDER BY oi.created_at ASC`,
    [orderId]
  );
  return result.rows;
};

const getOrderItemById = async (id) => {
  const result = await db.query(
    `SELECT oi.*, o.order_number, o.user_id
     FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE oi.id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateOrderItemQuantity = async (id, quantity) => {
  const result = await db.query(
    `UPDATE order_items 
     SET quantity = $1, total_price = unit_price * $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [quantity, id]
  );
  return result.rows[0];
};

const deleteOrderItem = async (id) => {
  const result = await db.query('DELETE FROM order_items WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const getOrderItemsByProduct = async (productId, limit = 50, offset = 0) => {
  const query = `
    SELECT oi.*, o.order_number, o.created_at as order_date, u.name as customer_name
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN users u ON o.user_id = u.id
    WHERE oi.product_id = $1
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [productId, limit, offset]);
  
  const countQuery = 'SELECT COUNT(*) FROM order_items WHERE product_id = $1';
  const countResult = await db.query(countQuery, [productId]);
  
  return {
    items: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const getTopSellingProducts = async (limit = 10) => {
  const result = await db.query(
    `SELECT p.id, p.name, p.slug, p.price, p.images,
            SUM(oi.quantity) as total_quantity_sold,
            COUNT(DISTINCT oi.order_id) as number_of_orders,
            SUM(oi.total_price) as total_revenue
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN orders o ON oi.order_id = o.id
     WHERE o.status != 'cancelled'
     GROUP BY p.id, p.name, p.slug, p.price, p.images
     ORDER BY total_quantity_sold DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const getSalesByProduct = async (startDate, endDate) => {
  const query = `
    SELECT p.id, p.name, 
           SUM(oi.quantity) as quantity_sold,
           SUM(oi.total_price) as revenue,
           COUNT(DISTINCT oi.order_id) as order_count
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at BETWEEN $1 AND $2
      AND o.status != 'cancelled'
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
  `;
  const result = await db.query(query, [startDate, endDate]);
  return result.rows;
};

const canUserReviewProduct = async (userId, productId) => {
  const result = await db.query(
    `SELECT EXISTS(
      SELECT 1 FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = $1 
        AND oi.product_id = $2 
        AND o.status = 'delivered'
    ) as can_review`,
    [userId, productId]
  );
  return result.rows[0].can_review;
};

module.exports = {
  createOrderItem,
  getOrderItemsByOrderId,
  getOrderItemById,
  updateOrderItemQuantity,
  deleteOrderItem,
  getOrderItemsByProduct,
  getTopSellingProducts,
  getSalesByProduct,
  canUserReviewProduct
};