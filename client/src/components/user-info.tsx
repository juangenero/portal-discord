import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const navigate = useNavigate();
  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          className="cursor-pointer"
          avatarProps={{
            src: 'https://cdn.discordapp.com/avatars/358835415383539715/b1b15879434c2043aa915c8bbc5587cb.png',
          }}
          name="xNeoXz"
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

        <DropdownItem
          key="delete"
          color="danger"
          className="text-danger"
          onClick={() => {
            navigate('/');
          }}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserInfo;
