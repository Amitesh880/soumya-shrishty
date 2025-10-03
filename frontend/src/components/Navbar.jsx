import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = ({containerStyles}) => {
  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={'/'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
        Home
        </NavLink>
        <NavLink to={'/listing'}  className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1" } >
        Listing

        </NavLink>
        <NavLink to={'mailto:info@zenhomes.com'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"}  >
        Contact

        </NavLink>
        <NavLink to={'/add-property'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
        Add Property

        </NavLink>
    </nav>
  )
}

export default Navbar
