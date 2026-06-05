import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3;
    
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, totalPageNumbers - 1);
      return [...leftRange, '...', totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(totalPages - (totalPageNumbers - 2), totalPages);
      return [1, '...', ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
      >
        <FaChevronLeft />
      </button>
      
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-primary-600 text-white border-primary-600'
              : page === '...'
              ? 'cursor-default border-transparent'
              : 'hover:bg-gray-50'
          }`}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;