// import type { NavigateOptions } from 'react-router-dom';

import { HeroUIProvider } from '@heroui/system';
import { useTheme } from '@heroui/use-theme';
import { NavigateOptions, useHref, useNavigate } from 'react-router-dom';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const ThemeInitializer: React.FC = () => {
  useTheme();
  return null;
};

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref} locale="es-ES">
      <ThemeInitializer />
      {children}
    </HeroUIProvider>
  );
}
