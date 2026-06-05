import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-primary-600 font-bold mt-1">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl text-primary-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="btn-primary w-full block text-center mb-2"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="btn-secondary w-full block text-center"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;