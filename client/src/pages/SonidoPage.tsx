import BaseLayout from '@/layouts/BaseLayout';
import { subtitle, title } from '@/shared/components/primitives';

export default function SonidoPage() {
  return (
    <BaseLayout>
      <h1 className={title()}>Sonidos</h1>

      <div className="mt-5">
        <h1 className={subtitle()}>Sonidisimo</h1>
      </div>
    </BaseLayout>
  );
}
