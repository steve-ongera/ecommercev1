const db = require('../config/db');

const getAllProducts = async (filters = {}, sort = '-created_at', limit = 20, offset = 0) => {
  let query = `
    SELECT p.*, c.name as category_name,
           COALESCE(AVG(r.rating), 0) as average_rating,
           COUNT(DISTINCT r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.is_active = true
  `;
  const params = [];
  let paramIndex = 1;

  if (filters.category) {
    query += ` AND p.category_id = $${paramIndex++}`;
    params.push(filters.category);
  }

  if (filters.minPrice) {
    query += ` AND p.price >= $${paramIndex++}`;
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND p.price <= $${paramIndex++}`;
    params.push(filters.maxPrice);
  }

  if (filters.featured === 'true') {
    query += ` AND p.is_featured = true`;
  }

  query += ` GROUP BY p.id, c.name`;

  // Sorting
  const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
  const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  
  // Get total count
  const countQuery = `
    SELECT COUNT(*) 
    FROM products p 
    WHERE p.is_active = true
    ${filters.category ? ` AND p.category_id = $1` : ''}
  `;
  const countResult = await db.query(countQuery, filters.category ? [filters.category] : []);
  
  return {
    products: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const getProductById = async (id) => {
  const query = `
    SELECT p.*, c.name as category_name,
           COALESCE(AVG(r.rating), 0) as average_rating,
           COUNT(DISTINCT r.id) as review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.id = $1
    GROUP BY p.id, c.name
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getProductBySlug = async (slug) => {
  const result = await db.query('SELECT * FROM products WHERE slug = $1 AND is_active = true', [slug]);
  return result.rows[0];
};

const createProduct = async (productData) => {
  const { name, slug, description, price, compare_price, stock, category_id, images, is_featured } = productData;
  const result = await db.query(
    `INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [name, slug, description, price, compare_price, stock, category_id, images, is_featured]
  );
  return result.rows[0];
};

const updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowedFields = ['name', 'slug', 'description', 'price', 'compare_price', 'stock', 'category_id', 'is_featured', 'is_active'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      fields.push(`${field} = $${idx++}`);
      values.push(updates[field]);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE products 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await db.query('UPDATE products SET is_active = false WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const updateStock = async (id, stock) => {
  const result = await db.query(
    'UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [stock, id]
  );
  return result.rows[0];
};

const getFeaturedProducts = async (limit = 8) => {
  const result = await db.query(
    `SELECT * FROM products 
     WHERE is_featured = true AND is_active = true 
     ORDER BY created_at DESC 
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const searchProducts = async (searchTerm, limit = 20, offset = 0) => {
  const query = `
    SELECT p.*, 
           ts_rank(to_tsvector('english', name || ' ' || COALESCE(description, '')), plainto_tsquery('english', $1)) as rank
    FROM products p
    WHERE is_active = true 
      AND to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $1)
    ORDER BY rank DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [searchTerm, limit, offset]);
  
  const countQuery = `
    SELECT COUNT(*)
    FROM products p
    WHERE is_active = true 
      AND to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $1)
  `;
  const countResult = await db.query(countQuery, [searchTerm]);
  
  return {
    products: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

const getLowStockProducts = async (threshold = 10) => {
  const result = await db.query(
    'SELECT * FROM products WHERE stock <= $1 AND is_active = true ORDER BY stock ASC',
    [threshold]
  );
  return result.rows;
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getFeaturedProducts,
  searchProducts,
  getLowStockProducts
};