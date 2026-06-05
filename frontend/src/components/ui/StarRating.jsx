import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 'default', showNumber = false }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClass = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-2xl'
  }[size];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${sizeClass}`}>{stars}</div>
      {showNumber && (
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;