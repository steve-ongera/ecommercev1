import axiosInstance from './axiosInstance';

export const categoryApi = {
  getCategories: () => axiosInstance.get('/categories'),
  getCategoryById: (id) => axiosInstance.get(`/categories/${id}`),
  getCategoryProducts: (id, params) => axiosInstance.get(`/categories/${id}/products`, { params }),
  createCategory: (data) => axiosInstance.post('/categories', data),
  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`)
};