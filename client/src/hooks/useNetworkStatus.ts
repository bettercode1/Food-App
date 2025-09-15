import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test network connectivity periodically
    const testConnection = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        setIsOnline(response.ok);
        setIsSlowConnection(responseTime > 2000); // Consider slow if > 2 seconds
      } catch {
        setIsOnline(false);
        setIsSlowConnection(false);
      }
    };

    testConnection(); // Initial check
    const interval = setInterval(testConnection, 30000); // Test every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isSlowConnection };
}