import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllOrders(filters);
      setOrders(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        pages: response.data.pagination.pages,
        total: response.data.pagination.total
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await adminApi.getOrderDetails(orderId);
      setSelectedOrder(response.data.order);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <select
            className="input w-48"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user_name}
                  <br />
                  <span className="text-xs">{order.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewOrderDetails(order.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Order Details - ${selectedOrder?.order_number}`}
        size="large"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm">Name: {selectedOrder.user_name}</p>
                <p className="text-sm">Email: {selectedOrder.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <p className="text-sm">Status: {selectedOrder.status}</p>
                <p className="text-sm">Payment: {selectedOrder.payment_method}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">{selectedOrder.shipping_address?.fullName}</p>
                <p className="text-sm">{selectedOrder.shipping_address?.addressLine1}</p>
                {selectedOrder.shipping_address?.addressLine2 && (
                  <p className="text-sm">{selectedOrder.shipping_address.addressLine2}</p>
                )}
                <p className="text-sm">
                  {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.zipCode}
                </p>
                <p className="text-sm">{selectedOrder.shipping_address?.country}</p>
                <p className="text-sm">Phone: {selectedOrder.shipping_address?.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-3">
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
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${selectedOrder.shipping_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${selectedOrder.tax_amount}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${selectedOrder.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedOrder.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;