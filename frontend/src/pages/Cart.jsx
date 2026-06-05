import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { removeFromCart, updateQuantity } from '../store/cartSlice'

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleRemove = (id) => {
    dispatch(removeFromCart(id))
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold hover:text-primary-600">{item.name}</h3>
                </Link>
                <p className="text-primary-600 font-bold mt-1">${item.price}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link to="/checkout" className="btn-primary w-full block text-center">
              Proceed to Checkout
            </Link>
            
            <Link to="/shop" className="block text-center mt-4 text-primary-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart