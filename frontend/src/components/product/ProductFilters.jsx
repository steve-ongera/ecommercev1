import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/category.api';

const ProductFilters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handlePriceChange = () => {
    setFilters({
      ...filters,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-created_at'
    });
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:underline"
        >
          Clear All
        </button>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={filters.category === ''}
              onChange={() => setFilters({ ...filters, category: '' })}
              className="mr-2"
            />
            <span>All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => setFilters({ ...filters, category: category.id })}
                className="mr-2"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            onBlur={handlePriceChange}
          />
          <input
            type="number"
            placeholder="Max"
            className="input"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            onBlur={handlePriceChange}
          />
        </div>
      </div>
      
      {/* Additional filters could be added here */}
      
      <div className="mt-6">
        <button
          onClick={() => setFilters({ ...filters })}
          className="btn-primary w-full"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;