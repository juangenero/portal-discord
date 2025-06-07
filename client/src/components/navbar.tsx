import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';

import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import UserInfo from './user-info';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Menu */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        {/* Logo */}
        <NavbarBrand className="gap-3 max-w-fit">
          <Link color="foreground" href="/">
            <Logo />
          </Link>
        </NavbarBrand>
        {/* Items menu */}
        <NavbarItem>
          <Link
            className={clsx(
              linkStyles({ color: 'foreground' }),
              'data-[active=true]:text-primary data-[active=true]:font-medium'
            )}
            color="foreground"
            href="/dashboard/sonidos"
          >
            Sonidos
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* Perfil / Switch */}
      <NavbarContent justify="end">
        <UserInfo />
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
