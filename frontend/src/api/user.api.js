import axiosInstance from './axiosInstance';

export const userApi = {
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/change-password', data),
  deleteAccount: () => axiosInstance.delete('/users/account')
};