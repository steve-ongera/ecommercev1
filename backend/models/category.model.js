const db = require('../config/db');

const getAllCategories = async (parentId = null) => {
  let query = 'SELECT * FROM categories WHERE is_active = true';
  const params = [];
  
  if (parentId === 'null' || parentId === null) {
    query += ' AND parent_id IS NULL';
  } else if (parentId) {
    query += ' AND parent_id = $1';
    params.push(parentId);
  }
  
  query += ' ORDER BY name';
  const result = await db.query(query, params);
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await db.query('SELECT * FROM categories WHERE id = $1 AND is_active = true', [id]);
  return result.rows[0];
};

const getCategoryProducts = async (categoryId, limit = 20, offset = 0) => {
  const query = `
    SELECT p.*, COALESCE(AVG(r.rating), 0) as average_rating
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.category_id = $1 AND p.is_active = true
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [categoryId, limit, offset]);
  
  const countQuery = 'SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_active = true';
  const countResult = await db.query(countQuery, [categoryId]);
  
  return {
    products: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const createCategory = async (categoryData) => {
  const { name, slug, description, parent_id, image_url } = categoryData;
  const result = await db.query(
    `INSERT INTO categories (name, slug, description, parent_id, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, slug, description, parent_id || null, image_url]
  );
  return result.rows[0];
};

const updateCategory = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowedFields = ['name', 'slug', 'description', 'parent_id', 'image_url', 'is_active'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      fields.push(`${field} = $${idx++}`);
      values.push(updates[field]);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE categories 
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteCategory = async (id) => {
  const result = await db.query('UPDATE categories SET is_active = false WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
};