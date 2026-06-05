const db = require('../config/db');

const getCartByUserId = async (userId) => {
  const cartResult = await db.query(
    'SELECT * FROM carts WHERE user_id = $1',
    [userId]
  );
  
  if (cartResult.rows.length === 0) return null;
  
  const cart = cartResult.rows[0];
  
  const itemsResult = await db.query(
    `SELECT ci.*, p.name, p.price, p.images
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`,
    [cart.id]
  );
  
  cart.items = itemsResult.rows;
  return cart;
};

const createCart = async (userId) => {
  const result = await db.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return result.rows[0];
};

const addToCart = async (cartId, productId, quantity) => {
  // Check if item exists
  const existingResult = await db.query(
    'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
    [cartId, productId]
  );
  
  if (existingResult.rows.length > 0) {
    const result = await db.query(
      'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
      [quantity, cartId, productId]
    );
    return result.rows[0];
  } else {
    const result = await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [cartId, productId, quantity]
    );
    return result.rows[0];
  }
};

const updateCartItem = async (itemId, quantity) => {
  const result = await db.query(
    'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
    [quantity, itemId]
  );
  return result.rows[0];
};

const removeFromCart = async (itemId) => {
  await db.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
  return true;
};

const clearCart = async (cartId) => {
  await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  return true;
};

const mergeCart = async (userId, sessionCart) => {
  const cart = await getCartByUserId(userId);
  
  if (!cart) {
    return null;
  }
  
  for (const item of sessionCart) {
    await addToCart(cart.id, item.product_id, item.quantity);
  }
  
  return await getCartByUserId(userId);
};

module.exports = {
  getCartByUserId,
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
};