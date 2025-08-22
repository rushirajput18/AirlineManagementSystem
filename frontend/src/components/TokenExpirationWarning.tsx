import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TokenExpirationWarningProps {
  warningThreshold?: number; // seconds before expiration to show warning
}

const TokenExpirationWarning: React.FC<TokenExpirationWarningProps> = ({ 
  warningThreshold = 300 // 5 minutes default
}) => {
  const { getTimeUntilExpiration, logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      const timeUntilExp = getTimeUntilExpiration();
      setTimeLeft(timeUntilExp);
      
      if (timeUntilExp !== null && timeUntilExp <= warningThreshold) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkExpiration();

    // Check every 30 seconds
    const interval = setInterval(checkExpiration, 30000);

    return () => clearInterval(interval);
  }, [getTimeUntilExpiration, warningThreshold]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
  };

  const handleRefresh = () => {
    // For now, just hide the warning
    // In a real app, you might want to implement token refresh logic
    setShowWarning(false);
  };

  if (!showWarning || timeLeft === null) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Session Expiring Soon
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Your session will expire in {formatTime(timeLeft)}</p>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleRefresh}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenExpirationWarning;
