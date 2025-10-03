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
      <h1 className='text-[49px] leading-tight md:text-[65px] md:leading-[1.3] mb-4 font-bold capitalize max-w-[41rem]'>Discover Your Dream Property Today</h1>
      <p className='my-5 max-w-[33rem]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit unde, adipisci architecto quasi accusantium tenetur eos quia modi repudiandae error aliquam, fuga asperiores molestias optio perspiciatis ut impedit doloribus libero.</p>
    <div className='inline-flex items-center justify-center gap-4 bg-white rounded ring ring-slate-900/5 mt-4'>
    <div className=' text-center text-[14px] font-[400] leading-tight pl-5 cursor-default'>
      <p className='text-[14px] font-[400]'><span className='uppercase font-bold'>10% off</span> On All Properties</p>
    </div>
    <Link to={'/listing'} className='text-[14px] font-[500] bg-black text-white ring ring-black  px-7 py-2 rounded-lg !rounded-tl-none !rounded-bl-none !rounded-lg'>Explore</Link>
    </div>
    <div className='flex flex-col gap-4 mt-10 mb-4 max-w-64'>
      <div className='flex relative'>
        <img src={client1} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full'/>
        <img src={client2} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full absolute left-8'/>
        <img src={client3} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full absolute left-16'/>
        <img src={client1} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full absolute left-24'/>
        <img src={client2} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full absolute left-32'/>
        <img src={client3} alt=" " className='h-[46px] border-2 border-white shadow-sm rounded-full absolute left-40'/>
        <div className='h-[46px] w-[46px] border-2 border-white shadow-sm bg-slate-500/70 text-white absolute left-48 rounded-full flex items-center justify-center text-xs font-semibold' >210k+</div>
      </div>
      <div className='text-[14px] md:text-[15px] mb-1 font-bold max-w-52'>People successfully got their dream homes</div>
    </div>
    <div className='flex flex-col'>
      <div className='flex gap-2 text-yellow-500 text-xs'>
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
      <div className='text-[14px] font-[700] sm:text-[16px]  relative top-1'>127k <span className='text-[14px] font-[400] sm:text-[16px]'>Excellent Reviews</span></div>
    </div>
    </div>
    </section>
  )
}

export default Hero
