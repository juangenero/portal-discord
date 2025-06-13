import { useAuth } from '@/modules/auth/AuthContext';
import { LogoutIcon, MoonIcon, SunIcon, UserIcon } from '@/shared/components/Icons';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const sizeIcons = 20;

  if (!isAuthenticated) return null;

  return (
    <Dropdown>
      {/* Avatar + username */}
      <DropdownTrigger>
        <User
          className="cursor-pointer"
          isFocusable={true}
          avatarProps={{
            src: `${user?.avatar}`,
          }}
          name={user?.username}
        />
      </DropdownTrigger>
      {/* Menu usuario */}
      <DropdownMenu>
        {/* Mi cuenta */}
        <DropdownItem
          key="perfil"
          startContent={<UserIcon size={sizeIcons} />}
          onPress={() => {
            navigate('/dashboard/perfil');
          }}
        >
          Mi cuenta
        </DropdownItem>

        {/* Modo claro-oscuro */}
        <DropdownItem
          textValue="Switch theme"
          key="theme"
          showDivider={true}
          startContent={
            theme === 'light' ? <MoonIcon size={sizeIcons} /> : <SunIcon size={sizeIcons} />
          }
          onPress={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        >
          {theme === 'light' && 'Modo oscuro'}
          {theme === 'dark' && 'Modo claro'}
        </DropdownItem>

        {/* Cerrar sesión */}
        <DropdownItem
          key="delete"
          startContent={<LogoutIcon size={sizeIcons} />}
          color="danger"
          className="text-danger"
          onPress={logout}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserMenu;
