import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({containerStyles}) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={'/'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
        Home
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to={'/listing'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1" } >
            Listing
            </NavLink>
            <NavLink to={'/contact'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
            Contact
            </NavLink>
          </>
        ) : (
          <NavLink to={'/login'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
          Login
          </NavLink>
        )}
    </nav>
  )
}

export default Navbar
