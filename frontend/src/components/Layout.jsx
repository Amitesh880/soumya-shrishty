import React, { useContext, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {useMutation} from 'react-query';
import { createUser } from '../utils/api'
import UserDetailContext from '../context/UserDetailContext'
import useFavourites from '../hooks/useFavourites'
import useBookings from '../hooks/useBookings'

const Layout = () => {
  const { isAuthenticated, user, token, isLoading } = useAuth();
  const { setUserDetails } = useContext(UserDetailContext);

  useFavourites()
  useBookings()

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token)
  });

  useEffect(() => {
    if (isAuthenticated && user && token) {
      // Update user details context with auth data
      setUserDetails(prev => ({
        ...prev,
        token: token,
        user: user
      }));
      
      // Register user with backend if needed
      mutate(token);
    }
  }, [isAuthenticated, user, token, setUserDetails, mutate]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
