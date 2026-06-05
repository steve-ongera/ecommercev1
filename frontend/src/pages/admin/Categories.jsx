import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/category.api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryApi.createCategory(formData);
        toast.success('Category created successfully!');
      }
      fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryApi.deleteCategory(id);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_id: '',
      image_url: ''
    });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id || '',
      image_url: category.image_url || ''
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
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            {category.image_url && (
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            )}
            {category.parent_id && (
              <p className="text-sm text-gray-500 mb-3">Parent Category: {category.parent_name}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              className="input"
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            >
              <option value="">None (Top Level)</option>
              {categories
                .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              className="input"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingCategory ? 'Update' : 'Create'} Category
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

export default AdminCategories;