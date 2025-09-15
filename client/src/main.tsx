
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/hooks/useTheme';
import { ViewModeProvider } from '@/hooks/useViewMode';
import { AuthContext } from '@/hooks/useAuth';
import { useAuthState } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import App from './App';
import './index.css';

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
