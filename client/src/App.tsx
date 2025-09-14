
import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/not-found';
import UserLogin from './components/UserLogin';
import ManagerLogin from './components/ManagerLogin';
import ManagerDashboard from './components/ManagerDashboard';
import NotificationCenter from './components/NotificationCenter';
import OfflineBanner from './components/OfflineBanner';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, userType } = useAuth();

  return (
    <ErrorBoundary>
      <Layout>
        <OfflineBanner />
        <NotificationCenter />
        <main className="flex-1">
          <Switch>
            <Route path="/login">
              {user ? <Home /> : <UserLogin />}
            </Route>
            <Route path="/manager/login">
              {user && userType === 'manager' ? <ManagerDashboard /> : <ManagerLogin />}
            </Route>
            <Route path="/manager/dashboard">
              {user && userType === 'manager' ? <ManagerDashboard /> : <ManagerLogin />}
            </Route>
            <Route path="/">
              {user ? <Home /> : <UserLogin />}
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
