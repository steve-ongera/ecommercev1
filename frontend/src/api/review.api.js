import axiosInstance from './axiosInstance';

export const reviewApi = {
  getProductReviews: (productId, page = 1) => 
    axiosInstance.get(`/reviews/product/${productId}`, { params: { page } }),
  createReview: (data) => axiosInstance.post('/reviews', data),
  updateReview: (id, data) => axiosInstance.put(`/reviews/${id}`, data),
  deleteReview: (id) => axiosInstance.delete(`/reviews/${id}`),
  markHelpful: (id) => axiosInstance.post(`/reviews/${id}/helpful`)
};