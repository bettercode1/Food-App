
import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/not-found';
import OfflineBanner from './components/OfflineBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, userType } = useAuth();

  return (
    <ErrorBoundary>
      <Layout>
        <OfflineBanner />
        <main className="flex-1">
          <Switch>
            <Route path="/login">
              {user ? <Home /> : <Home />}
            </Route>
            <Route path="/manager/login">
              {user && userType === 'manager' ? <Home /> : <Home />}
            </Route>
            <Route path="/manager/dashboard">
              {user && userType === 'manager' ? <Home /> : <Home />}
            </Route>
            <Route path="/">
              <Home />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </main>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
