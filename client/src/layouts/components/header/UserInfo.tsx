import { useAuth } from '@/modules/auth/AuthContext';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          className="cursor-pointer"
          avatarProps={{
            src: `${user?.avatar}`,
          }}
          name={user?.username}
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="perfil"
          showDivider={true}
          onClick={() => {
            navigate('/dashboard/perfil');
          }}
        >
          Mi perfil
        </DropdownItem>

        <DropdownItem key="delete" color="danger" className="text-danger" onClick={logout}>
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserInfo;
