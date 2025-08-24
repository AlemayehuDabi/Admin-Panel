import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
import Login from './pages/login';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { WorkerManagement } from './pages/WorkerManagement';
import { CompanyManagement } from './pages/CompanyManagement';
import { JobManagement } from './pages/JobManagement';
import { WalletOverview } from './pages/WalletOverview';
import { Analytics } from './pages/Analytics';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  // const { isAuthenticated } = useAuthStore();

  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/workers" element={<WorkerManagement />} />
        <Route path="/companies" element={<CompanyManagement />} />
        <Route path="/jobs" element={<JobManagement />} />
        <Route path="/wallet" element={<WalletOverview />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  );
}

export default App;
