const db = require('../config/db');

const getAllCoupons = async (limit = 20, offset = 0) => {
  const query = `
    SELECT * FROM coupons 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const result = await db.query(query, [limit, offset]);
  
  const countQuery = 'SELECT COUNT(*) FROM coupons';
  const countResult = await db.query(countQuery);
  
  return {
    coupons: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const validateCoupon = async (code, orderAmount) => {
  const result = await db.query(
    `SELECT * FROM coupons 
     WHERE code = $1 
       AND is_active = true 
       AND valid_from <= NOW() 
       AND valid_until >= NOW()
       AND (usage_limit IS NULL OR used_count < usage_limit)
       AND minimum_order <= $2`,
    [code.toUpperCase(), orderAmount]
  );
  return result.rows[0];
};

const createCoupon = async (couponData) => {
  const { code, description, discount_type, discount_value, minimum_order, 
          maximum_discount, usage_limit, valid_from, valid_until } = couponData;
  
  const result = await db.query(
    `INSERT INTO coupons (code, description, discount_type, discount_value, 
      minimum_order, maximum_discount, usage_limit, valid_from, valid_until)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [code.toUpperCase(), description, discount_type, discount_value, 
     minimum_order || 0, maximum_discount, usage_limit, valid_from, valid_until]
  );
  return result.rows[0];
};

const updateCoupon = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;
  
  const allowedFields = ['code', 'description', 'discount_type', 'discount_value', 
                         'minimum_order', 'maximum_discount', 'usage_limit', 
                         'valid_from', 'valid_until', 'is_active'];
  
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === 'code') {
        fields.push(`${field} = $${idx++}`);
        values.push(updates[field].toUpperCase());
      } else {
        fields.push(`${field} = $${idx++}`);
        values.push(updates[field]);
      }
    }
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  const query = `
    UPDATE coupons 
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteCoupon = async (id) => {
  const result = await db.query('DELETE FROM coupons WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const incrementCouponUsage = async (id) => {
  const result = await db.query(
    'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage
};