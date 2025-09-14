import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  wasOffline: boolean;
  backendReachable: boolean;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    wasOffline: false,
    backendReachable: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    let wasOffline = false;

    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true, wasOffline }));
      
      if (wasOffline) {
        toast({
          title: 'Back Online! 🌐',
          description: 'Your internet connection has been restored.',
          duration: 3000,
        });
        wasOffline = false;
      }
    };

    const handleOffline = () => {
      wasOffline = true;
      setNetworkStatus(prev => ({ ...prev, isOnline: false, wasOffline: true }));
      
      toast({
        variant: 'destructive',
        title: 'No Internet Connection 📡',
        description: 'Some features may not work properly while offline.',
        duration: 5000,
      });
    };

    // Check connection speed using Network Information API (if available)
    const checkConnectionSpeed = () => {
      // @ts-ignore - Network Information API is experimental
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        setNetworkStatus(prev => ({ ...prev, isSlowConnection: slowConnection }));
        
        if (slowConnection && !networkStatus.isSlowConnection) {
          toast({
            title: 'Slow Connection Detected 🐌',
            description: 'Loading times may be slower than usual.',
            duration: 4000,
          });
        }
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed periodically
    checkConnectionSpeed();
    const speedCheckInterval = setInterval(checkConnectionSpeed, 30000); // Every 30 seconds

    // Test backend connectivity periodically  
    const testBackend = async () => {
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/health', { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          
          const backendReachable = response.ok;
          setNetworkStatus(prev => ({ ...prev, backendReachable }));
          
          if (!backendReachable && networkStatus.backendReachable) {
            // Backend just became unreachable
            console.warn('Backend connectivity lost');
          }
        } catch (error) {
          console.warn('Backend connectivity test failed:', error);
          setNetworkStatus(prev => ({ ...prev, backendReachable: false }));
        }
      }
    };

    const backendTestInterval = setInterval(testBackend, 60000); // Every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(speedCheckInterval);
      clearInterval(backendTestInterval);
    };
  }, [toast, networkStatus.isSlowConnection]);

  return networkStatus;
}