import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium text-white ${
      !isOnline ? 'bg-destructive' : 'bg-yellow-600'
    }`}>
      {!isOnline ? (
        <div className="flex items-center justify-center space-x-2">
          <i className="fas fa-wifi-slash"></i>
          <span>You're offline - Some features may not work properly</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Slow connection detected - Loading may take longer</span>
        </div>
      )}
    </div>
  );
}
