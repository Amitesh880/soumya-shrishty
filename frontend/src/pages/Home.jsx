import React,{useState,useEffect} from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Achievements from '../components/Achievements'
import Properties from '../components/Properties'
import About from '../components/About'
import Testimonals from '../components/Testimonals'
import { useAuth0 } from '@auth0/auth0-react'

const Home = () => {

  const {loginWithRedirect, isAuthenticated,user ,logout}= useAuth0()



  return (
    <main className=' w-full mx-auto  bg-gradient-to-r from-yellow-200 via-white to-white'>

      <Hero/>
      <Features/>
      <Achievements/>
      {!isAuthenticated }
      <Properties/>
      <About/>
      <Testimonals/>
    </main>
  )
}

export default Home


// max-w-[1440px]