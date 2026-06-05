import axiosInstance from './axiosInstance';

export const productApi = {
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  getProductBySlug: (slug) => axiosInstance.get(`/products/slug/${slug}`),
  getFeaturedProducts: () => axiosInstance.get('/products/featured'),
  searchProducts: (query) => axiosInstance.get('/products/search', { params: { q: query } }),
  createProduct: (data) => axiosInstance.post('/products', data),
  updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
  updateStock: (id, stock) => axiosInstance.patch(`/products/${id}/stock`, { stock })
};