import React, { use, useContext, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {useMutation} from 'react-query';
import { createUser } from '../utils/api'
import UserDetailContext from '../context/UserDetailContext'
import useFavourites from '../hooks/useFavourites'
import useBookings from '../hooks/useBookings'

const Layout = () => {

  useFavourites()
  useBookings()

  const {isAuthenticated,user, getAccessTokenSilently, getAccessTokenWithPopup} = useAuth0();
  const {setUserDetails} = useContext(UserDetailContext);
  const {mutate} = useMutation({
    mutationKey:[user?.email],
    mutationFn:(token)=> createUser(user?.email,token)
  })

  useEffect(()=>{
    const getTokenAndRegister = async()=>{
      try {
        const res = await getAccessTokenSilently({
          authorizationParams:{
            audience:"https://real-estate-backend-nine-opal.vercel.app",
            scope:"openid profile email"
          }
        })
        console.log("Access token retrieved:", res ? "Success" : "Failed");
        localStorage.setItem("access_token",res)
        setUserDetails((prev)=>({...prev,token:res}))
        mutate(res)
      } catch (error) {
        console.error("Error getting access token:", error);
        // If silent token retrieval fails, try with popup as fallback
        try {
          const res = await getAccessTokenWithPopup({
            authorizationParams:{
              audience:"https://real-estate-backend-nine-opal.vercel.app",
              scope:"openid profile email"
            }
          })
          console.log("Access token retrieved via popup:", res ? "Success" : "Failed");
          localStorage.setItem("access_token",res)
          setUserDetails((prev)=>({...prev,token:res}))
          mutate(res)
        } catch (popupError) {
          console.error("Error getting access token via popup:", popupError);
        }
      }
    }
    isAuthenticated && getTokenAndRegister()
  },[isAuthenticated])
  return (
    <>
      <div>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default Layout
