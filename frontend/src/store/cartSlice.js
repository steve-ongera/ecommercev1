import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  totalQuantity: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 })
      }
      
      localStorage.setItem('cart', JSON.stringify(state.items))
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
      cartSlice.caseReducers.calculateTotals(state)
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalAmount = 0
      localStorage.removeItem('cart')
    },
    
    calculateTotals: (state) => {
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer