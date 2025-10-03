import React from 'react'
import about1 from "../assets/about1.png"
import about2 from "../assets/about2.png"
import { FaScreenpal,FaUpDown } from 'react-icons/fa6'
import { FaEnvelope ,FaInbox,FaList,FaMap,FaMapMarkedAlt,FaUser } from 'react-icons/fa'

const About = () => {
  return (
   <section className='mx-auto max-w-[1440px] px-6 lg:px-12'>
    <div className='flex items-center flex-col lg:flex-row gap-12'>
    <div className='flex-1'>
      <div className='relative'>
       
          <img src={about1} alt="AboutImg" className='rounded-3xl'/>
          <span className='absolute top-8 left-8 bg-white px-2 rounded-full text-[14px] font-[500]'>San Francisco</span>

        </div>
      </div>
      <div className='flex-1'>
        <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Empowering You to Find Your Dream Home,Effortlessly</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, nisi! Modi velit ipsum, eaque quasi consectetur eos soluta sit mollitia autem, aliquid aut cumque labore ullam aperiam iste facere repellendus.
        </p>
        <div className='flex flex-col gap-6 mt-5'>
          <div className='flex gap-3'>
            <FaScreenpal className='text-green-400'/>
            <p>Virtual property tours and viewings</p>
          </div>
          <div className='flex gap-3'>
            <FaUpDown className='text-green-400'/>
            <p>Real-time market price updates</p>
          </div>
          <div className='flex gap-3'>
            <FaMap className='text-green-400'/>
            <p>Interactive floor plans and maps</p>
          </div>
          <div className='flex gap-3'>
            <FaMapMarkedAlt className='text-green-400'/>
            <p>Access to off-market properties</p>
          </div>
          <div className='flex gap-3'>
            <FaEnvelope className='text-green-400'/>
            <p>Direct messaging with agents and owners</p>
          </div>
        </div>
      </div>

    </div>
    <div className='flex items-center flex-col lg:flex-row gap-12 mt-36'>
    
      <div className='flex-1'>
        <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Simplify Your Real Estate Journey Every Step of the Way</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, nisi! Modi velit ipsum, eaque quasi consectetur eos soluta sit mollitia autem, aliquid aut cumque labore ullam aperiam iste facere repellendus.
        </p>
        <div className='flex flex-col gap-6 mt-5'>
          <div className='flex gap-3'>
            <FaList className='text-green-400'/>
            <p>In-app scheduling for property viewings</p>
          </div>
          <div className='flex gap-3'>
            <FaUpDown className='text-green-400'/>
            <p>Real-time market price updates</p>
          </div>
          <div className='flex gap-3'>
            <FaInbox className='text-green-400'/>
            <p>User-friendly interface for smooth navigation</p>
          </div>
          <div className='flex gap-3'>
            <FaUser className='text-green-400'/>
            <p>Detailed agent and realtor profiles</p>
          </div>
          <div className='flex gap-3'>
            <FaMapMarkedAlt className='text-green-400'/>
            <p>Access to off-market properties</p>
          </div>
        </div>
      </div>
      <div className='flex-1'>
      <div className='relative flex justify-end'>
       
          <img src={about2} alt="AboutImg" className='rounded-3xl'/>
          <span className='absolute top-8 right-8 bg-white px-2 rounded-full text-[14px] font-[500]'>Golden Coast</span>

        </div>
      </div>

    </div>
   </section>
  )
}

export default About
