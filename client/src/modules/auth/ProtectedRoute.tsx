import { useAuth } from '@/modules/auth/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './components/Loader';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
