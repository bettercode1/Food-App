import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContext, useAuthState } from "@/hooks/useAuth";
import { ThemeContext, useThemeState } from "@/hooks/useTheme";
import { ViewModeContext, useViewModeState } from "@/hooks/useViewMode";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineBanner from "@/components/OfflineBanner";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authState = useAuthState();
  const themeState = useThemeState();
  const viewModeState = useViewModeState();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ViewModeContext.Provider value={viewModeState}>
          <ThemeContext.Provider value={themeState}>
            <AuthContext.Provider value={authState}>
              <TooltipProvider>
                <OfflineBanner />
                <Layout>
                  <Toaster />
                  <Router />
                </Layout>
              </TooltipProvider>
            </AuthContext.Provider>
          </ThemeContext.Provider>
        </ViewModeContext.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
