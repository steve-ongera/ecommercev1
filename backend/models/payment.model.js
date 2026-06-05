const db = require('../config/db');

const createPayment = async (paymentData) => {
  const { order_id, payment_method, amount, transaction_id, payment_details } = paymentData;
  
  const result = await db.query(
    `INSERT INTO payments (order_id, payment_method, amount, transaction_id, payment_details)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [order_id, payment_method, amount, transaction_id, JSON.stringify(payment_details || {})]
  );
  return result.rows[0];
};

const getPaymentById = async (id) => {
  const result = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
  return result.rows[0];
};

const getPaymentByOrderId = async (orderId) => {
  const result = await db.query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
  return result.rows[0];
};

const getPaymentByTransactionId = async (transactionId) => {
  const result = await db.query('SELECT * FROM payments WHERE transaction_id = $1', [transactionId]);
  return result.rows[0];
};

const updatePaymentStatus = async (transactionId, status) => {
  const result = await db.query(
    `UPDATE payments 
     SET payment_status = $1, updated_at = NOW() 
     WHERE transaction_id = $2 
     RETURNING *`,
    [status, transactionId]
  );
  return result.rows[0];
};

const updatePaymentDetails = async (id, details) => {
  const result = await db.query(
    `UPDATE payments 
     SET payment_details = payment_details || $1::jsonb, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(details), id]
  );
  return result.rows[0];
};

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentByOrderId,
  getPaymentByTransactionId,
  updatePaymentStatus,
  updatePaymentDetails
};