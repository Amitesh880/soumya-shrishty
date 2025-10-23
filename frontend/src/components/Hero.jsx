import React from 'react'
import { Link } from 'react-router-dom'
import client1 from "../assets/client1.jpg"
import client2 from "../assets/client2.jpg"
import client3 from "../assets/client3.jpg"
import { FaStar } from 'react-icons/fa'
import bg from "../assets/bg.png";



const Hero = () => {
  return (
    // <section className='mx-auto max-w-[1440px] px-6 lg:px-12 bg-hero'>
    // <section className='mx-auto max-w-[1440px] px-6 lg:px-12    bg-cover bg-center'>
    <section
  style={{ backgroundImage: `url(${bg})` }}
  className='mx-auto  px-6 lg:px-12 bg-cover  bg-no-repeat h-[722px] w-full'
>

    <div className='relative top-32 xs:top-48'>
      <h1 className='text-[40px] leading-tight md:text-[65px] md:leading-[1.3] mb-4 font-bold capitalize max-w-[41rem]'>Discover Your Dream Property Today with Soumya & Srishty Properties Pvt. Ltd.</h1>
      <p className='my-5 max-w-[33rem]'>Build your future with Soumya & Srishty Properties Pvt. Ltd., a trusted real estate company offering Awasiy land use plots across Gorakhpur, Lucknow, Kushinagar, Sukrali, and Hetam.
We specialize in residential and investment plots that perfectly match your budget and location preferences.</p>
    <div className='inline-flex items-center justify-center gap-4 bg-white rounded ring ring-slate-900/5 mt-4'>
    <div className=' text-center text-[14px] font-[400] leading-tight pl-5 cursor-default'>
      <p className='text-[14px] font-[400]'>Explore All Properties</p>
    </div>
    <Link to={'/listing'} className='text-[14px] font-[500] bg-black text-white ring ring-black  px-7 py-2 rounded-lg !rounded-tl-none !rounded-bl-none !rounded-lg'>Explore</Link>
    </div>
    <div className='flex flex-col'>
      <div className='flex gap-2 text-yellow-500 text-xs'>
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
    </div>
    </section>
  )
}

export default Hero
