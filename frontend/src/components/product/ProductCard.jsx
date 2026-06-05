import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.jpg'
    }))
    toast.success('Added to cart!')
  }

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden h-64">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          {product.compare_price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Sale
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(product.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.review_count || 0})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">${product.price}</span>
            {product.compare_price && (
              <span className="text-gray-400 line-through ml-2">${product.compare_price}</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition"
            disabled={product.stock === 0}
          >
            <FaShoppingCart />
          </button>
        </div>
        
        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-2">Out of stock</p>
        )}
      </div>
    </div>
  )
}

export default ProductCard