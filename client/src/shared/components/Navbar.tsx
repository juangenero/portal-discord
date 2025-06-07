import { Link } from '@heroui/link';
import { Navbar as HeroUINavbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';

import { Logo } from '@/shared/components/Icons';
import { ThemeSwitch } from '@/shared/components/ThemeSwitch';
import UserInfo from './UserInfo';

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
