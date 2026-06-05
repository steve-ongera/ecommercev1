const db = require('../config/db');

const createUser = async (userData) => {
  const { name, email, password_hash, role = 'user' } = userData;
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password_hash, role]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query(
    'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.avatar) {
    fields.push(`avatar = $${idx++}`);
    values.push(updates.avatar);
  }
  if (updates.password_hash) {
    fields.push(`password_hash = $${idx++}`);
    values.push(updates.password_hash);
  }

  values.push(id);
  const query = `
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE id = $${idx}
    RETURNING id, name, email, role, avatar
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

const getAllUsers = async (limit, offset) => {
  const result = await db.query(
    `SELECT id, name, email, role, created_at 
     FROM users 
     ORDER BY created_at DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

const countUsers = async () => {
  const result = await db.query('SELECT COUNT(*) FROM users');
  return parseInt(result.rows[0].count);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsers,
  countUsers
};