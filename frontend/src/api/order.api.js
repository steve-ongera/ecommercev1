import axiosInstance from './axiosInstance';

export const orderApi = {
  createOrder: (orderData) => axiosInstance.post('/orders', orderData),
  getUserOrders: (page = 1) => axiosInstance.get('/orders', { params: { page } }),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),
  cancelOrder: (id) => axiosInstance.put(`/orders/${id}/cancel`),
  confirmOrder: (id) => axiosInstance.post(`/orders/${id}/confirm`)
};