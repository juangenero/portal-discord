import BaseLayout from '@/layouts/BaseLayout';
import { useAuth } from '@/modules/auth/AuthContext';
import { rutaProtegidaTest } from '@/services/api.service';
import { title } from '@/shared/components/primitives';
import { addToast, Button } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';

function TestPage() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <BaseLayout>
      <section className="flex flex-col gap-10 justify-center items-center">
        <h1 className={title()}>Test</h1>
        {/* BOTONES */}
        <div className="flex flex-row gap-2">
          <Button
            onPress={() => {
              alert('Un cs?');
            }}
          >
            Botón para el SONE
          </Button>
          <Button onPress={rutaProtegidaTest}>Test endpoint protegido</Button>
          <Button
            onPress={() => {
              addToast({
                title: 'Título',
                description: 'Aquí va un mensaje bien chido...',
                severity: 'default',
                color: 'default',
              });
            }}
          >
            Test message
          </Button>
        </div>

        {/* TEXTOS */}
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="font-bold text-2xl">theme</h1>
          <span className=" text-center">{theme}</span>
          <h1 className="font-bold text-2xl">user</h1>
          <span className=" text-center w-8/12">{JSON.stringify(user)}</span>
        </div>
      </section>
    </BaseLayout>
  );
}

export default TestPage;
