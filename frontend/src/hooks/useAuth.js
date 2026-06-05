import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      dispatch(setCredentials(response.data));
      toast.success('Login successful!');
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleRegister = async (userData) => {
    try {
      const response = await authApi.register(userData);
      dispatch(setCredentials(response.data));
      toast.success('Registration successful!');
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  };
};

export default useAuth;