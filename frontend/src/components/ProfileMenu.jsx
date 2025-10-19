import React from 'react';
import { MenuDropdown,Menu , Avatar,MenuItem, MenuLabel } from '@mantine/core'
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({user,logout}) => {
  const navigate = useNavigate();
  return (
    <Menu>
        <Menu.Target>
            <Avatar src={user.picture} alt="userimg" radius="xl"/>
        </Menu.Target>
        <MenuDropdown>
            <MenuLabel>Applications</MenuLabel>
            <MenuItem onClick={()=> navigate("./favourites",{replace:true})} >
            Favourites
            </MenuItem>
            <MenuItem  onClick={()=> navigate("./bookings",{replace:true})}>
            Bookings
            </MenuItem>
            <MenuLabel>Go Back</MenuLabel>
            <MenuItem onClick={()=>{
                localStorage.clear()
                logout()
            }} color="red">LogOut</MenuItem>
        </MenuDropdown>
    </Menu>
  )
}
export default ProfileMenu