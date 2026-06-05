import axiosInstance from './axiosInstance';

export const paymentApi = {
  createPaymentIntent: (orderId) => axiosInstance.post('/payments/create-payment-intent', { order_id: orderId }),
  getPaymentStatus: (orderId) => axiosInstance.get(`/payments/order/${orderId}`),
  refundPayment: (paymentId) => axiosInstance.post(`/payments/${paymentId}/refund`)
};