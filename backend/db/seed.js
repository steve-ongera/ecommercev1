const bcrypt = require('bcryptjs');
const db = require('../config/db');
const slugify = require('../utils/slugify');

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@example.com', adminPassword, 'admin']
    );
    console.log('✓ Admin user created');

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Books', slug: 'books' },
      { name: 'Home & Garden', slug: 'home-garden' }
    ];

    for (const cat of categories) {
      await db.query(
        `INSERT INTO categories (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug]
      );
    }
    console.log('✓ Categories created');

    // Get category IDs
    const categoryResult = await db.query('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryResult.rows.forEach(row => {
      categoryMap[row.name] = row.id;
    });

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        stock: 50,
        category_id: categoryMap['Electronics'],
        is_featured: true
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        stock: 100,
        category_id: categoryMap['Clothing'],
        is_featured: false
      },
      {
        name: 'JavaScript: The Good Parts',
        slug: 'javascript-good-parts',
        description: 'Essential JavaScript book by Douglas Crockford',
        price: 29.99,
        stock: 30,
        category_id: categoryMap['Books'],
        is_featured: true
      }
    ];

    for (const product of products) {
      await db.query(
        `INSERT INTO products (name, slug, description, price, stock, category_id, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [product.name, product.slug, product.description, product.price, 
         product.stock, product.category_id, product.is_featured]
      );
    }
    console.log('✓ Sample products created');

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    process.exit();
  }
}

seed();