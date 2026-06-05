import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex gap-4 py-4 border-b">
      <Link to={`/product/${item.id}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded"
        />
      </Link>
      
      <div className="flex-1">
        <Link to={`/product/${item.id}`}>
          <h3 className="font-semibold hover:text-primary-600">{item.name}</h3>
        </Link>
        <p className="text-primary-600 font-bold mt-1">${item.price}</p>
        
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border rounded">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-50"
            >
              <FaMinus className="text-xs" />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-50"
            >
              <FaPlus className="text-xs" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItem;