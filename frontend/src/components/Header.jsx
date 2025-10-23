import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logosoumya.png"
import Navbar from './Navbar'
import { MdClose, MdMenu } from 'react-icons/md'
import { LuUserRound } from 'react-icons/lu'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from './ProfileMenu'

const Header = () => {

    const [active,setactive]=useState(false)
    const [menuOpened,setMenuOpenend]=useState(false)
    const toggleMenu=()=> {setMenuOpenend((prev)=>!prev)
    }

    useEffect(()=>{
        const handleScroll=()=>{
            if(window.scrollY>0){
                if(menuOpened){
                    setMenuOpenend(false)
                }
            }
            setactive(window.scrollY>30)
        }
        window.addEventListener("scroll",handleScroll)
        return()=>{
            window.removeEventListener("scroll",handleScroll)
        }
    },[menuOpened])

  const {isAuthenticated, user, logout} = useAuth()

  return (
   <header className={`${active ? "py-1 bg-white shadow-md" : "py-2"}  mx-auto  px-6 lg:px-12 fixed top-0 w-full left-0 right-0 z-50 transition-all duration-200`}>
    
         <div className="flex items-center justify-between">
            <div>
                <Link to={'/'}>
                <img src={logo} alt="logo" className="h-16" />
                </Link>
            </div>
            <div className="flex items-center justify-center gap-x-4">
                <Navbar containerStyles={"hidden xl:flex gap-x-5 xl:gap-x-12 capitalize text-[15px] font-[500]"} />
                <Navbar containerStyles={`${menuOpened ? "flex items-start flex-col gap-y-8 capitalize fixed top-20 right-8 p-12 bg-white shadow-md rounded-2xl w-64 text-[15px] font-[500] ring ring-slate-900/5 transition-all duration-300 z-50 " : "flex items-start flex-col gap-y-8 capitalize fixed top-20 -right-[100%] p-12 bg-white shadow-md rounded-2xl w-64 text-[15px] font-[500] ring ring-slate-900/5 transition-all duration-300 z-50"}`} />
            </div>
            <div className="flex items-center justify-between gap-x-3 sm:gap-x-5 text-[16px] font-[700]">
                {!menuOpened ? (
                    <MdMenu onClick={toggleMenu} className='xl:hidden cursor-pointer text-3xl'/>

                ):(
                    <MdClose onClick={toggleMenu}className='xl:hidden cursor-pointer text-3xl' />
                )}
                {!isAuthenticated ? <Link to="/login" className="flex items-center justify-center gap-x-2  text-[14px] font-[500] bg-black text-white ring ring-black  px-7 py-2 rounded-lg">
                    <LuUserRound className="text-xl"/>
                    <span>Log In</span>
                </Link>:<ProfileMenu user={user} logout={logout}/>
                }
            </div>
        </div>
    

   </header>
  )
}

export default Header
