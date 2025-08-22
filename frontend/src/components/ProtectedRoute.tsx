import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, clearAuthData } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();

  useEffect(() => {
    // Check authentication on component mount and when location changes
    if (!isAuthenticated()) {
      clearAuthData();
    }
  }, [location]);

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole) {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (userRole === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (userRole === 'staff') {
        return <Navigate to="/staff-dashboard" replace />;
      } else {
        // If role is invalid, clear auth data and redirect to login
        clearAuthData();
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
