import axiosInstance from './axiosInstance';

export const cartApi = {
  getCart: () => axiosInstance.get('/cart'),
  addToCart: (productId, quantity) => axiosInstance.post('/cart/items', { product_id: productId, quantity }),
  updateCartItem: (itemId, quantity) => axiosInstance.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => axiosInstance.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosInstance.delete('/cart'),
  mergeCart: (sessionCart) => axiosInstance.post('/cart/merge', { sessionCart })
};