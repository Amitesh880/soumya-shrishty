import React,{useState} from 'react'
import { NavLink } from 'react-router-dom'
import AddPropertyModal from './AddPropertyModal'
import useAuthCheck from '../hooks/useAuthCheck'

const Navbar = ({containerStyles}) => {
  const [modalOpened,setModalOpened]=useState(false)
  const {validateLogin} = useAuthCheck()

 const handleAddPropertyClick = ()=>{
   if(validateLogin()){
    setModalOpened(true)
   }
 }

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
        <div onClick={handleAddPropertyClick} className={"py-1 cursor-pointer"} >
        Add Property
        </div>
        <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
    </nav>
  )
}

export default Navbar
