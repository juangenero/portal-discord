import BaseLayout from '@/layouts/BaseLayout';
import { useAuth } from '@/modules/auth/AuthContext';
import { DiscordIcon } from '@/shared/components/Icons';
import { Button } from '@heroui/react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <BaseLayout showNavbar={false}>
      <div className="absolute inset-0 z-0">
        <img src="img/3.png" alt="Background" className="h-full w-full object-cover" />
      </div>

      <div className="absolute flex min-h-screen w-full items-start justify-center pt-48">
        <section className="px-20 py-10 max-w-md backdrop-blur rounded-3xl">
          <Button onPress={login} size="lg" color="primary" isLoading={isLoading}>
            <DiscordIcon />
            Iniciar sesión
          </Button>
        </section>
      </div>
    </BaseLayout>
  );
}
