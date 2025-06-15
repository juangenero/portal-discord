import BaseLayout from '@/layouts/BaseLayout';
import { title } from '@/shared/components/primitives';
import { useTheme } from '@heroui/use-theme';

export default function SonidoPage() {
  const { theme } = useTheme();

  return (
    <BaseLayout>
      <h1 className={title()}>Sonidos</h1>

      <div>
        <img
          src={theme === 'light' ? '/images/soundboard_light.png' : '/images/soundboard_dark.png'}
          alt="soundboard"
          onClick={() => {
            window.open('https://alcala-city.github.io/soundboard', '_blank');
          }}
          className="rounded-lg cursor-pointer mt-10"
        />
      </div>
    </BaseLayout>
  );
}
