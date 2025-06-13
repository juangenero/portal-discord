import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';

import { Logo } from '@/shared/components/Icons';
import { Link as RouterLink } from 'react-router-dom';
import UserMenu from './UserMenu';

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
        <NavbarItem>
          <RouterLink color="foreground" to="/dashboard/sonidos">
            Sonidos
          </RouterLink>
        </NavbarItem>
      </NavbarContent>
      {/* Menú de usuario */}
      <NavbarContent justify="end">
        <UserMenu />
      </NavbarContent>
    </HeroUINavbar>
  );
};
