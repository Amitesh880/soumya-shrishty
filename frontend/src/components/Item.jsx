import React from 'react'
import { CgRuler } from 'react-icons/cg'
import { FaHeart } from 'react-icons/fa'
import { MdSquareFoot } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import HeartBtn from './HeartBtn'

const Item = ({property}) => {
  const navigate=useNavigate()
  return (
    <div onClick={()=>{navigate(`../listing/${property.id}`)}} className='rounded-lg overflow-hidden bg-white ring ring-slate-900/5'>
      <div className='relative'>
        <img src ={property.image} alt={property.title} className='h-[13rem] w-full aspect-square object-cover'/>
        <div className='absolute top-4 right-6'>
            <HeartBtn id={property.id}/>
        </div>
     </div>
        <div className='m-3'>
            <div className='flex items-center justify-between'>
                <h5 className='text-[16px] font-[700] my-1 text-green-400 '>{property.city}</h5>
                <h4 className='text-[16px] md:text-[17px] mb-2 font-bold'>${property.price}.00/sq. ft.</h4>
            </div>
            <h4 className='text-[18px] font-[500] line-clamp-1' >{property.title}</h4>
            <div className='flex gap-x-2 py-2'>
                <div className='flex items-center justify-center gap-x-2 border-r border-slate-900/50 pr-4  font-[500]'>
                <MdSquareFoot /> {property.facilities.area} sq. ft.
                </div>
                <div className='flex items-center justify-center gap-x-2 border-r border-slate-900/50  pr-4  font-[500]'>
               <CgRuler />400
                </div>
            </div>
            <p className='pt-2 mb-4 line-clamp-2'>{property.description}</p>
        </div>
      </div>
      
   
  )
}

export default Item
