import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthData, getTokenPayload } from '../utils/auth';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        const role = localStorage.getItem('userRole');
        const data = localStorage.getItem('userData');
        setUserRole(role);
        setUserData(data);
      } else {
        setUserRole(null);
        setUserData(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Set up interval to check auth every minute
    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    clearAuthData();
    setIsAuth(false);
    setUserRole(null);
    setUserData(null);
    navigate('/login');
  };

  const getTokenExpirationTime = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = getTokenPayload(token);
    return payload?.exp || null;
  };

  const getTimeUntilExpiration = (): number | null => {
    const expTime = getTokenExpirationTime();
    if (!expTime) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, expTime - currentTime);
  };

  return {
    isAuthenticated: isAuth,
    userRole,
    userData,
    logout,
    getTokenExpirationTime,
    getTimeUntilExpiration,
  };
};
