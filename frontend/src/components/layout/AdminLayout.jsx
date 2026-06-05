import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaTags, 
  FaChartLine,
  FaSignOutAlt 
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/products', icon: FaBox, label: 'Products' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/customers', icon: FaUsers, label: 'Customers' },
    { path: '/admin/categories', icon: FaTags, label: 'Categories' },
    { path: '/admin/coupons', icon: FaTags, label: 'Coupons' },
    { path: '/admin/reports', icon: FaChartLine, label: 'Reports' }
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;