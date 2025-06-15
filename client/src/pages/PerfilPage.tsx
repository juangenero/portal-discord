import BaseLayout from '@/layouts/BaseLayout';
import { useAuth } from '@/modules/auth/AuthContext';
import SesionesActivas from '@/modules/profile/components/SesionesActivas';
import { subtitle } from '@/shared/components/primitives';
import { Avatar } from '@heroui/react';

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <BaseLayout>
      <div className="flex flex-col gap-5">
        {/* Información */}
        <section>
          <h1 className={subtitle()}>Información</h1>
          <Avatar className="w-28 h-28" src={user?.avatar} />
        </section>
        {/* Sesiones activas */}
        <section>
          <h1 className={subtitle()}>Sesiones activas</h1>
          <SesionesActivas />
        </section>
      </div>
    </BaseLayout>
  );
}
