import BaseLayout from '@/layouts/BaseLayout';
import { rutaProtegidaTest } from '@/services/api.service';
import { title } from '@/shared/components/primitives';
import { axiosInterceptorResponse } from '@/shared/utils/axios-instance';
import { addToast, Button } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';
import { useEffect, useState } from 'react';

function TestPage() {
  const { theme, setTheme } = useTheme();
  const [state, setState] = useState('a');

  useEffect(() => {
    // Configuramos los interceptores cuando el componente se monta.
    // Le pasamos la función setAppState para que el interceptor pueda actualizar el estado.
    axiosInterceptorResponse(setState);
  }, []);

  return (
    <BaseLayout>
      <section className="flex flex-col gap-10 justify-center items-center">
        <h1 className={title()}>Test</h1>
        {/* BOTONES */}
        <div className="flex flex-row gap-2">
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
        <div className="flex flex-col gap-2">
          <span>theme: {theme}</span>
          <span>state: {state}</span>
        </div>
      </section>
    </BaseLayout>
  );
}

export default TestPage;
