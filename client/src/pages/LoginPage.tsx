import BaseLayout from '@/layouts/BaseLayout';
import { useAuth } from '@/modules/auth/AuthContext';
import Loader from '@/modules/auth/components/Loader';
import { DiscordIcon } from '@/shared/components/Icons';
import { Button } from '@heroui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Loader que se muestra mientras se hace la redirección del useEffect cuando se está logado
  if (isAuthenticated && !isLoading) {
    return <Loader />;
  }

  return (
    <BaseLayout showNavbar={false}>
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img src="img/3.png" alt="background login page" className="h-full w-full object-cover" />
      </div>

      {/* Cuadro de login */}
      <div className="absolute flex min-h-screen w-full items-start justify-center pt-48">
        <section className="px-20 py-10 max-w-md backdrop-blur rounded-3xl">
          <Button
            onPress={async () => {
              login();
            }}
            size="lg"
            color="primary"
            isLoading={isLoading}
          >
            {!isLoading && <DiscordIcon />}
            Iniciar sesión
          </Button>
        </section>
      </div>
    </BaseLayout>
  );
}
