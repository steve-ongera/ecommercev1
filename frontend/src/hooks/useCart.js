import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const addItem = (product, quantity = 1) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity
    }));
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const updateItemQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const emptyCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  return {
    items,
    totalQuantity,
    totalAmount,
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
    isEmpty: items.length === 0
  };
};

export default useCart;