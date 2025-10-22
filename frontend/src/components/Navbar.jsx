import React,{useState} from 'react'
import { NavLink } from 'react-router-dom'
// Removed AddPropertyModal and related imports
// import AddPropertyModal from './AddPropertyModal'
// import useAuthCheck from '../hooks/useAuthCheck'

const Navbar = ({containerStyles}) => {
  // Removed state and auth check for Add Property modal
  // const [modalOpened,setModalOpened]=useState(false)
  // const {validateLogin} = useAuthCheck()

 // const handleAddPropertyClick = ()=>{
 //   if(validateLogin()){
 //    setModalOpened(true)
 //   }
 // }

  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={'/'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"} >
        Home
        </NavLink>
        <NavLink to={'/listing'}  className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1" } >
        Listing

        </NavLink>
        <NavLink to={'/contact'} className={({isActive})=>isActive ? "relative after:w-2/3 after:h-[2px] after:rounded-full after:bg-black after:absolute after:-bottom-2 after:left-0 py-1" :"py-1"}  >
        Contact

        </NavLink>
        {/* Removed Add Property trigger */}
        {/* <div onClick={handleAddPropertyClick} className={"py-1 cursor-pointer"} >
        Add Property
        </div>
        <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} /> */}
    </nav>
  )
}

export default Navbar
