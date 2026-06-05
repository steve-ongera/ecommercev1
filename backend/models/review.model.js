const db = require('../config/db');

const getProductReviews = async (productId, limit = 20, offset = 0) => {
  const query = `
    SELECT r.*, u.name as user_name, u.avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [productId, limit, offset]);
  
  const countQuery = 'SELECT COUNT(*) FROM reviews WHERE product_id = $1';
  const countResult = await db.query(countQuery, [productId]);
  
  const avgQuery = 'SELECT COALESCE(AVG(rating), 0) as avg FROM reviews WHERE product_id = $1';
  const avgResult = await db.query(avgQuery, [productId]);
  
  return {
    reviews: result.rows,
    total: parseInt(countResult.rows[0].count),
    averageRating: parseFloat(avgResult.rows[0].avg)
  };
};

const createReview = async (reviewData) => {
  const { user_id, product_id, rating, title, comment } = reviewData;
  
  // Check if user has purchased the product
  const purchaseCheck = await db.query(
    `SELECT EXISTS(
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'delivered'
    )`,
    [user_id, product_id]
  );
  
  const is_verified_purchase = purchaseCheck.rows[0].exists;
  
  const result = await db.query(
    `INSERT INTO reviews (user_id, product_id, rating, title, comment, is_verified_purchase)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, product_id) DO UPDATE
     SET rating = EXCLUDED.rating, title = EXCLUDED.title, 
         comment = EXCLUDED.comment, updated_at = NOW()
     RETURNING *`,
    [user_id, product_id, rating, title, comment, is_verified_purchase]
  );
  
  // Update product average rating
  await updateProductRating(product_id);
  
  return result.rows[0];
};

const updateReview = async (reviewId, userId, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;
  
  if (updates.rating) {
    fields.push(`rating = $${idx++}`);
    values.push(updates.rating);
  }
  if (updates.title) {
    fields.push(`title = $${idx++}`);
    values.push(updates.title);
  }
  if (updates.comment) {
    fields.push(`comment = $${idx++}`);
    values.push(updates.comment);
  }
  
  if (fields.length === 0) return null;
  
  values.push(reviewId, userId);
  const query = `
    UPDATE reviews 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx++} AND user_id = $${idx}
    RETURNING *
  `;
  
  const result = await db.query(query, [...values, reviewId, userId]);
  
  if (result.rows[0]) {
    const review = result.rows[0];
    await updateProductRating(review.product_id);
  }
  
  return result.rows[0];
};

const deleteReview = async (reviewId, userId) => {
  const review = await db.query(
    'SELECT product_id FROM reviews WHERE id = $1 AND user_id = $2',
    [reviewId, userId]
  );
  
  const result = await db.query(
    'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id',
    [reviewId, userId]
  );
  
  if (result.rows[0] && review.rows[0]) {
    await updateProductRating(review.rows[0].product_id);
  }
  
  return result.rows[0];
};

const updateProductRating = async (productId) => {
  const result = await db.query(
    `SELECT COALESCE(AVG(rating), 0) as avg, COUNT(*) as count
     FROM reviews 
     WHERE product_id = $1`,
    [productId]
  );
  
  await db.query(
    'UPDATE products SET average_rating = $1, review_count = $2 WHERE id = $3',
    [result.rows[0].avg, result.rows[0].count, productId]
  );
};

const markHelpful = async (reviewId) => {
  const result = await db.query(
    'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1 RETURNING *',
    [reviewId]
  );
  return result.rows[0];
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
};