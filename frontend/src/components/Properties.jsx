import React from 'react'
import { VscSettings } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { Swiper,SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from'swiper/modules';
import { PROPERTIES } from '../constant/data';
import Item from './Item';




const Properties = () => {
  return (
    <section className='mx-auto  px-6 lg:px-12'>
    <div className='py-16 xl:py-28 rounded-3xl'>
        <span className='text-[18px] font-[500]'>Your Future Home Awaits!</span>
        <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Find Your Dream Here</h2>
        <div className='flex items-center justify-between mt-8 mb-6'>
            <h5><span className='font-bold'>Showing 1-9</span>out of 3k properties</h5>
            <Link to={'/'} className='bg-green-500 text-white text-2xl rounded-md p-2 flex items-center justify-center'>
            <VscSettings />
            </Link>
    </div>
    <Swiper
    autoplay={{
        delay:4000,
        disableOnInteraction:false,
    }}
    breakpoints={{
        600:{
            slidesPerView:2,
            spaceBetween:30,
        },
        1124:{
            slidesPerView:3,
            spaceBetween:30,
        },
        1300:{
            slidesPerView:4,
            spaceBetween:30,
        }
    }}
    modules={[Autoplay]}
    className="h-[488px] md:h-[533px] xl:h-[422px] mt-5"
    >
        {PROPERTIES.slice(0,6).map((property)=>(
             <SwiperSlide key={property.title}>
                <Item property={property}/>
             </SwiperSlide>
        ))}
       
    </Swiper>
    </div>
    </section>
  )
}

export default Properties
