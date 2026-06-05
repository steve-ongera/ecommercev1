import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaStore, FaShoppingCart, FaUser, FaHeart, FaClipboardList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/shop', icon: FaStore, label: 'Shop' },
    { path: '/cart', icon: FaShoppingCart, label: 'Cart', badge: totalQuantity },
    { path: '/wishlist', icon: FaHeart, label: 'Wishlist' }
  ];

  const authItems = isAuthenticated ? [
    { path: '/profile', icon: FaUser, label: 'Profile' },
    { path: '/orders', icon: FaClipboardList, label: 'Orders' }
  ] : [];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      
      <aside className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary-600">Menu</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {authItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;