import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaTimesCircle className="text-red-500" />,
    warning: <FaExclamationCircle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${backgrounds[type]} animate-slide-up`}>
      {icons[type]}
      <span className="text-sm text-gray-700">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <FaTimesCircle />
      </button>
    </div>
  );
};

export default Toast;