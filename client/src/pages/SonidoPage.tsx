import BaseLayout from '@/layouts/BaseLayout';
import Sonidos from '@/modules/sonido/components/Sonidos';
import { SonidoProvider } from '@/modules/sonido/SonidoContext';
import { title } from '@/shared/components/primitives';

export default function SonidoPage() {
  return (
    <SonidoProvider>
      <BaseLayout>
        <h1 className={title()}>Soundboard</h1>
        <br />
        <Sonidos />
      </BaseLayout>
    </SonidoProvider>
  );
}
