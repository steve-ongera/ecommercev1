import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import { format } from 'date-fns';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getUserOrders(page);
      setOrders(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {format(new Date(order.created_at), 'PPP')}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    ${order.total_amount.toFixed(2)}
                  </p>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product_image || 'https://via.placeholder.com/60'}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.unit_price}
                      </p>
                    </div>
                    <p className="font-semibold">${item.total_price}</p>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-sm text-gray-600">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;