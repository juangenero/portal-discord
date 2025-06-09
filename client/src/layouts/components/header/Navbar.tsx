import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';

import { ThemeSwitch } from '@/layouts/components/header/ThemeSwitch';
import UserInfo from '@/layouts/components/header/UserInfo';
import { Logo } from '@/shared/components/Icons';
import { Link as RouterLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="static">
      {/* Logo */}
      <NavbarBrand>
        <RouterLink color="foreground" to="/">
          <Logo />
        </RouterLink>
      </NavbarBrand>
      {/* Menu */}
      <NavbarContent justify="center">
        {/* Items menu */}
        <NavbarItem>
          <RouterLink color="foreground" to="/dashboard/sonidos">
            Sonidos
          </RouterLink>
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
