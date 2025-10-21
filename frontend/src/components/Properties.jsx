import React from 'react'
import { VscSettings } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { Swiper,SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from'swiper/modules';
import Item from './Item';
import useProperties from '../hooks/useProperties'
import { PuffLoader } from 'react-spinners'




const Properties = () => {
     const {data,isError,isLoading}=useProperties()

     if(isError) {
      return <div className='h-64 flex flex-col justify-center items-center mt-24'>
        <span className='text-red-500 text-lg'>Error fetching data</span>
        <span className='text-gray-500 text-sm mt-2'>Please check your connection and try again</span>
        </div>
        }
     if(isLoading) {
      return <div className='h-64 flex justify-center mt-24 items-center'>
        <PuffLoader height="80" width="80" radius={1} color='#555' aria-label="puff-loading" />
      </div>
     }
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
        {data && data.length > 0 ? (
          data.slice(0,6).map((property)=>(
               <SwiperSlide key={property.id || property.title}>
                  <Item property={property}/>
               </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className='text-center py-8'>
              <span className='text-gray-500 text-lg'>No properties available</span>
            </div>
          </SwiperSlide>
        )}
       
    </Swiper>
    </div>
    </section>
  )
}

export default Properties
