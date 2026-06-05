import axiosInstance from './axiosInstance';

export const adminApi = {
  getDashboardStats: () => axiosInstance.get('/admin/dashboard'),
  getSalesChart: (days = 30) => axiosInstance.get('/admin/sales-chart', { params: { days } }),
  getAllOrders: (params) => axiosInstance.get('/admin/orders', { params }),
  getOrderDetails: (id) => axiosInstance.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => axiosInstance.put(`/admin/orders/${id}/status`, { status }),
  getLowStockProducts: (threshold = 10) => axiosInstance.get('/admin/products/low-stock', { params: { threshold } }),
  getAllUsers: (params) => axiosInstance.get('/admin/users', { params }),
  updateUserRole: (id, role) => axiosInstance.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getSalesReport: (period = 'month') => axiosInstance.get('/admin/reports/sales', { params: { period } }),
  getTopProducts: (limit = 10) => axiosInstance.get('/admin/reports/top-products', { params: { limit } })
};