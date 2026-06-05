import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductImageGallery = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img
          src="https://via.placeholder.com/500"
          alt={productName}
          className="w-full h-96 object-cover"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
        <img
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-96 object-cover cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                currentIndex === index ? 'border-primary-600' : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <img
              src={images[currentIndex]}
              alt={productName}
              className="w-full h-auto rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;