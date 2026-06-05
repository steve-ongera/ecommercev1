import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      dispatch(clearCart());
    }
  }, [order, dispatch]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Order Number:</span> {order.order_number}
            </p>
            <p>
              <span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span> ${order.total_amount.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span> {order.payment_method}
            </p>
            <p>
              <span className="font-medium">Order Status:</span> {order.status}
            </p>
          </div>
        </div>
        
        <div className="space-x-4">
          <Link to="/orders" className="btn-primary inline-block">
            View My Orders
          </Link>
          <Link to="/shop" className="btn-secondary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;