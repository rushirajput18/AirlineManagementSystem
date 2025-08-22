import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  role?: string;
  [key: string]: any;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token has expiration time and if it's expired
    if (decoded.exp && decoded.exp < currentTime) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider invalid tokens as expired
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  
  return !isTokenExpired(token);
};
