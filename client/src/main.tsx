
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/hooks/useTheme';
import { ViewModeProvider } from '@/hooks/useViewMode';
import { AuthContext } from '@/hooks/useAuth';
import { useAuthState } from '@/hooks/useAuth';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppProviders() {
  const authState = useAuthState();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthContext.Provider value={authState}>
          <ThemeProvider>
            <ViewModeProvider>
              <App />
              <Toaster />
            </ViewModeProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
