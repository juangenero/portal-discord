import { useAuth } from '@/modules/auth/AuthContext';
import { Spinner } from '@heroui/react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Loader que se muestra cuando se accede a una ruta protegida y está en proceso de autenticación
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner variant="gradient" size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
