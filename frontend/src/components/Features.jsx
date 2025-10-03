import React from 'react'
import { FaListAlt } from 'react-icons/fa'
import { AiOutlineFileSearch } from 'react-icons/ai'
import { IoBookmarksOutline,IoTicketOutline } from 'react-icons/io5'
import { RiFileList3Line } from 'react-icons/ri'

const Features = () => {
  return (
   <section  className='mx-auto  px-6 lg:px-12 py-10 bg-white'>
    <div className='mx-auto  px-6 lg:px-12 flex items-center justify-between flex-wrap gap-8' >
        <div className='flex items-start gap-x-3'>
            <RiFileList3Line className='text-3xl'/>
            <h4 className='text-[18px] font-[500]'>Detailed Listing</h4>
        </div>
        <div className='flex items-start gap-x-3'>
            <AiOutlineFileSearch className='text-3xl'/>
            <h4 className='text-[18px] font-[500]'>Property Search</h4>
        </div>
        <div className='flex items-start gap-x-3'>
            <IoBookmarksOutline className='text-3xl'/>
            <h4 className='text-[18px] font-[500]'>Saved Favorites</h4>
        </div>
        <div className='flex items-start gap-x-3'>
            <IoTicketOutline className='text-4xl relative bottom-1'/>
            <h4 className='text-[18px] font-[500]'>Book Visits</h4>
        </div>
    </div>
   </section>
  )
}

export default Features
