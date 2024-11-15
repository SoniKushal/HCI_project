// AuthMiddleware.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context';

const AuthMiddleware = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  useEffect(() => {
    // Owner-only routes
    const ownerRoutes = ['/ownerdashboard', '/addrestaurant', '/ownerrestaurant'];
    // Customer-only routes
    const customerRoutes = ['/', '/bookings'];
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/forgotpassword', '/reset-password'];
    
    // Check if current path is a owner route
    const isOwnerRoute = ownerRoutes.some(route => currentPath.startsWith(route));
    // Check if current path is a customer route
    const isCustomerRoute = customerRoutes.includes(currentPath);
    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

    // If not authenticated and not on a public route, redirect to login
    if (!user && !isPublicRoute) {
      navigate('/login');
      return;
    }

    // If authenticated and on a public route, redirect based on role
    if (user && isPublicRoute) {
      navigate(user.role === 'owner' ? '/ownerdashboard' : '/');
      return;
    }

    // If authenticated as owner trying to access customer routes
    if (user?.role === 'owner' && isCustomerRoute) {
      navigate('/ownerdashboard');
      return;
    }

    // If authenticated as customer trying to access owner routes
    if (user?.role === 'customer' && isOwnerRoute) {
      navigate('/');
      return;
    }
  }, [user, currentPath, navigate]);

  return children;
};

export default AuthMiddleware;