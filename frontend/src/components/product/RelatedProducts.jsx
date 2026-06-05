import { useState, useEffect } from 'react';
import { productApi } from '../../api/product.api';
import ProductCard from './ProductCard';

const RelatedProducts = ({ currentProductId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getProducts({
        category: categoryId,
        limit: 4
      });
      // Filter out current product
      const filtered = response.data.data.filter(p => p.id !== currentProductId);
      setProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;