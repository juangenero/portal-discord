import {
  Navbar as HeroUINavbar,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';

import { ThemeSwitch } from '@/layouts/components/header/ThemeSwitch';
import UserInfo from '@/layouts/components/header/UserInfo';
import { Logo } from '@/shared/components/Icons';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Menu */}
      <NavbarContent justify="center">
        {/* Logo */}
        <NavbarBrand>
          <Link color="foreground" href="/">
            <Logo />
          </Link>
        </NavbarBrand>
        {/* Items menu */}
        <NavbarItem>
          <Link color="foreground" href="/dashboard/sonidos">
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
