import React, { Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'
import Listing from './pages/Listing'
import Property from './pages/Property'
import Favourites from './pages/Favourites'
import Bookings from './pages/Bookings'
import Contact from './pages/Contact'
import Login from './pages/Login'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import UserDetailContext from './context/UserDetailContext'
import { AuthProvider } from './context/AuthContext'
import 'leaflet/dist/leaflet.css';

const App = () => {
  const queryClient = new QueryClient()
  const [userDetails,setUserDetails]=useState({
    Favourites:[],
    bookings:[],
    token:null
  })

  return (
    <AuthProvider>
      <UserDetailContext.Provider value={{userDetails,setUserDetails}}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route element={<Layout />}>
                  <Route path='/' element={<Home />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/listing'>
                    <Route index element={<Listing />} />
                    <Route path=':propertyId' element={<Property />} />
                  </Route>
                  <Route path='/bookings' element={<Bookings />} />
                  <Route path='/favourites' element={<Favourites />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </AuthProvider>
  )
}

export default App
