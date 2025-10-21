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

  const {isAuthenticated,user, getAccessTokenSilently, getAccessTokenWithPopup, loginWithRedirect} = useAuth0();
  const {setUserDetails} = useContext(UserDetailContext);
  const {mutate} = useMutation({
    mutationKey:[user?.email],
    mutationFn:(token)=> createUser(user?.email,token)
  })

  useEffect(()=>{
    const getTokenAndRegister = async()=>{
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping token retrieval");
        return;
      }
      
      // First, try to get token from localStorage if it exists
      const existingToken = localStorage.getItem("access_token");
      if (existingToken && existingToken.length > 0) {
        console.log("Using existing token from localStorage");
        setUserDetails((prev)=>({...prev,token:existingToken}))
        return;
      }
      
      try {
        console.log("Attempting to get access token silently...");
        const res = await getAccessTokenSilently({
          authorizationParams:{
            audience:"http://localhost:3000", // Temporarily using localhost until Auth0 is updated
            scope:"openid profile email"
          },
          timeout: 10000 // 10 second timeout
        })
        console.log("Access token retrieved:", res ? "Success" : "Failed");
        console.log("Token value:", res);
        console.log("Token length:", res?.length);
        console.log("Token type:", typeof res);
        
        if (res && typeof res === 'string' && res.length > 0) {
          localStorage.setItem("access_token",res)
          setUserDetails((prev)=>({...prev,token:res}))
          mutate(res)
        } else {
          console.error("Invalid token received:", res);
          // If token is invalid, redirect to login
          console.log("Redirecting to login due to invalid token");
          loginWithRedirect();
        }
      } catch (error) {
        console.error("Error getting access token:", error);
        
        // If it's a timeout or authentication error, redirect to login
        if (error.message.includes('Timeout') || error.message.includes('authentication')) {
          console.log("Authentication timeout or error, redirecting to login");
          loginWithRedirect();
          return;
        }
        
        // For other errors, try popup as fallback
        try {
          console.log("Attempting to get access token via popup...");
          const res = await getAccessTokenWithPopup({
            authorizationParams:{
              audience:"http://localhost:3000", // Temporarily using localhost until Auth0 is updated
              scope:"openid profile email"
            }
          })
          console.log("Access token retrieved via popup:", res ? "Success" : "Failed");
          console.log("Popup token value:", res);
          console.log("Popup token length:", res?.length);
          
          if (res && typeof res === 'string' && res.length > 0) {
            localStorage.setItem("access_token",res)
            setUserDetails((prev)=>({...prev,token:res}))
            mutate(res)
          } else {
            console.error("Invalid popup token received:", res);
            console.log("Redirecting to login due to invalid popup token");
            loginWithRedirect();
          }
        } catch (popupError) {
          console.error("Error getting access token via popup:", popupError);
          console.log("All authentication methods failed, redirecting to login");
          loginWithRedirect();
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
