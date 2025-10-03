import React from 'react'
import { FaCheck, FaStar }from 'react-icons/fa'
import user1 from "../assets/testimonials/user1.png"
import user2 from "../assets/testimonials/user2.png"
import property1 from "../assets/img1.png"
import property2 from "../assets/img2.png"
import property3 from "../assets/img3.png"
import property4 from "../assets/img4.png"

const Testimonals = () => {
  return (
    <section className='mx-auto  px-6 lg:px-12 bg-white py-16 xl:pt-28'>
      <div className='grid grid-cols-1 lg:grid-cols-[2fr_5fr] gap-20 mb-16 rounded-2xl'>
        <div className='flex items-start justify-between flex-col gap-10'>
          <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Customer feedback and experiences</h2>
          <div className='flex flex-col gap-1 bg-white p-2 rounded ring-1 ring-slate-900/5'>
            <div className='flex text-green-400 gap-2'>
              <FaStar/>
              <FaStar/>
              <FaStar/>
              <FaStar/>
              <FaStar/>
            </div >
            <div className='text-[14px] font-[500]'>
              Showing 1-2 out of <b>2k reviews</b>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-7'>
        <div className='rounded-lg p-4 bg-white ring-1 ring-slate-900/5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-center gap-x-2'>
              <img src={user1} alt="userImg" height={44} width={44} className='rounded-full' />
              <h5 className='text-[14px] font-[700]'>John Doe</h5>
            </div>
            <div className='bg-green-400 text-white rounded-full flex items-center justify-center gap-x-2 p-1 px-2 text-xs font-semibold '>
              <FaCheck />
              Verified
            </div>
          </div>
          <hr className='h-[1px] w-full my-2'/>
          <div className='flex gap-x-1 text-green-400 mt-5 mb-1 text-xs'>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <h4 className='text-[16px] md:text-[17px] mb-2 font-bold'>High Quality</h4>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla quisquam voluptatibus animi doloremque voluptas veritatis alias reprehenderit necessitatibus nisi incidunt cupiditate atque officia eaque dolore, exercitationem, recusandae esse! Alias, natus.</p>
          <div className='flex gap-x-1 mt-5'>
            <img src={property1} alt="propertyImg" height={44} width={44} className='rounded aspect-square object-cover' />
            <img src={property2} alt="propertyImg" height={44} width={44} className='rounded aspect-square object-cover' />
          </div>
        </div>
        <div className='rounded-lg p-4 bg-white ring-1 ring-slate-900/5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-center gap-x-2'>
              <img src={user2} alt="userImg" height={44} width={44} className='rounded-full' />
              <h5 className='text-[14px] font-[700]'>Izabella Stress</h5>
            </div>
            <div className='bg-green-400 text-white rounded-full flex items-center justify-center gap-x-2 p-1 px-2 text-xs font-semibold '>
              <FaCheck />
              Verified
            </div>
          </div>
          <hr className='h-[1px] w-full my-2'/>
          <div className='flex gap-x-1 text-green-400 mt-5 mb-1 text-xs'>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <h4 className='text-[16px] md:text-[17px] mb-2 font-bold'>Modern Design</h4>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla quisquam voluptatibus animi doloremque voluptas veritatis alias reprehenderit necessitatibus nisi incidunt cupiditate atque officia eaque dolore, exercitationem, recusandae esse! Alias, natus.</p>
          <div className='flex gap-x-1 mt-5'>
            <img src={property3} alt="propertyImg" height={44} width={44} className='rounded aspect-square object-cover' />
            <img src={property4} alt="propertyImg" height={44} width={44} className='rounded aspect-square object-cover' />
          </div>
        </div>

      </div>
      </div>
    </section>
   
  )
}

export default Testimonals
