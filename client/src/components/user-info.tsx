import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react';

function UserInfo() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          avatarProps={{
            src: 'https://cdn.discordapp.com/avatars/358835415383539715/b1b15879434c2043aa915c8bbc5587cb.png',
          }}
          name="xNeoXz"
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="1">Mi perfil</DropdownItem>
        <DropdownItem key="2">Logout</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserInfo;
