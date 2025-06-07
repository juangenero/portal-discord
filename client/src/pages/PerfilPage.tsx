import BaseLayout from '@/layouts/BaseLayout';
import { title } from '@/shared/components/primitives';

export default function PerfilPage() {
  return (
    <BaseLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Profile</h1>
        </div>
      </section>
    </BaseLayout>
  );
}
