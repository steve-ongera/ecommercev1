import { useState, useEffect } from 'react';
import { couponApi } from '../../api/coupon.api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_order: '',
    maximum_discount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponApi.getCoupons();
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCoupon) {
        await couponApi.updateCoupon(editingCoupon.id, formData);
        toast.success('Coupon updated successfully!');
      } else {
        await couponApi.createCoupon(formData);
        toast.success('Coupon created successfully!');
      }
      fetchCoupons();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponApi.deleteCoupon(id);
        toast.success('Coupon deleted successfully!');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order: '',
      maximum_discount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: ''
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order: coupon.minimum_order || '',
      maximum_discount: coupon.maximum_discount || '',
      usage_limit: coupon.usage_limit || '',
      valid_from: coupon.valid_from.split('T')[0],
      valid_until: coupon.valid_until.split('T')[0]
    });
    setShowModal(true);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-primary-600">
                    {coupon.code}
                  </span>
                 </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {coupon.description || '-'}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coupon.discount_type === 'percentage' 
                    ? `${coupon.discount_value}% OFF`
                    : `$${coupon.discount_value} OFF`
                  }
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(coupon.valid_until).toLocaleDateString()}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coupon.used_count} / {coupon.usage_limit || '∞'}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    coupon.is_active && new Date(coupon.valid_until) > new Date()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.is_active && new Date(coupon.valid_until) > new Date() ? 'Active' : 'Expired'}
                  </span>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                className="input font-mono uppercase"
                placeholder="SUMMER2024"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                required
                className="input"
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                required
                className="input"
                placeholder={formData.discount_type === 'percentage' ? '10' : '5.00'}
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount
              </label>
              <input
                type="number"
                step="0.01"
                className="input"
                placeholder="0.00"
                value={formData.minimum_order}
                onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Discount
              </label>
              <input
                type="number"
                step="0.01"
                className="input"
                placeholder="Unlimited"
                value={formData.maximum_discount}
                onChange={(e) => setFormData({ ...formData, maximum_discount: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum discount amount (for percentage discounts)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                type="number"
                className="input"
                placeholder="Unlimited"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid From *
              </label>
              <input
                type="date"
                required
                className="input"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until *
              </label>
              <input
                type="date"
                required
                className="input"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              className="input"
              placeholder="Brief description of this coupon"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingCoupon ? 'Update' : 'Create'} Coupon
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCoupons;