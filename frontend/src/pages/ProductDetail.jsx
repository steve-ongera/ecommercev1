import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { productApi } from '../api/product.api';
import { reviewApi } from '../api/review.api';
import { addToCart } from '../store/cartSlice';
import { FaStar, FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import toast from 'react-hot-toast';
import StarRating from '../components/ui/StarRating';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getProductById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewApi.getProductReviews(id);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg',
      quantity
    }));
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images?.[activeImage] || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <StarRating rating={product.average_rating || 0} />
              <span className="text-gray-600 ml-2">
                ({product.review_count || 0} reviews)
              </span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">SKU: {product.id.slice(0, 8)}</span>
          </div>
          
          <div className="mb-4">
            {product.compare_price && product.compare_price > product.price ? (
              <div>
                <span className="text-3xl font-bold text-primary-600">
                  ${product.price}
                </span>
                <span className="text-gray-400 line-through ml-2">
                  ${product.compare_price}
                </span>
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                  Save ${(product.compare_price - product.price).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                ${product.price}
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-medium">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock} items)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
            
            {product.category && (
              <div className="flex items-center gap-4">
                <span className="font-medium">Category:</span>
                <Link to={`/shop?category=${product.category_id}`} className="text-primary-600 hover:underline">
                  {product.category_name}
                </Link>
              </div>
            )}
          </div>
          
          {product.stock > 0 && (
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border-r hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 border-l hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              
              <button className="btn-secondary flex items-center gap-2">
                <FaHeart /> Wishlist
              </button>
              
              <button className="btn-secondary flex items-center gap-2">
                <FaShare /> Share
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={review.user_avatar || 'https://via.placeholder.com/40'}
                    alt={review.user_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{review.user_name}</p>
                    <StarRating rating={review.rating} size="small" />
                  </div>
                </div>
                {review.title && (
                  <h3 className="font-semibold mt-2">{review.title}</h3>
                )}
                <p className="text-gray-700 mt-1">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {product.stock > 0 && (
          <button className="btn-primary mt-6">
            Write a Review
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;