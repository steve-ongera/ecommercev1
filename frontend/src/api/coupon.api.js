import axiosInstance from './axiosInstance';

export const couponApi = {
  getCoupons: (params) => axiosInstance.get('/coupons', { params }),
  validateCoupon: (code, orderAmount) => axiosInstance.post('/coupons/validate', { code, orderAmount }),
  createCoupon: (data) => axiosInstance.post('/coupons', data),
  updateCoupon: (id, data) => axiosInstance.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => axiosInstance.delete(`/coupons/${id}`)
};