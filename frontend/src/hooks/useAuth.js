import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logout, clearError } from '../store/slices/authSlice';
import { ROUTES } from '../constants/routes';

/**
 * Custom hook for authentication operations.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleRegister = async (name, email, password) => {
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

export default useAuth;
