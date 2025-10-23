import React from 'react'
import about1 from "../assets/about1.png"
import about2 from "../assets/about2.png"
import { FaScreenpal, FaUpDown } from 'react-icons/fa6'
import { FaEnvelope, FaInbox, FaList, FaMap, FaMapMarkedAlt, FaUser } from 'react-icons/fa'

const About = () => {
  return (
    <section className='mx-auto max-w-[1440px] px-6 lg:px-12'>
      <div className='flex items-center flex-col lg:flex-row gap-12'>
        <div className='flex-1'>
          <div className='relative'>

            <img src={about1} alt="AboutImg" className='rounded-3xl' />
            <span className='absolute top-8 left-8 bg-white px-2 rounded-full text-[14px] font-[500]'>San Francisco</span>

          </div>
        </div>
        <div className='flex-1'>
          <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Empowering You to Find Your Dream Home,Effortlessly</h2>
          <p>
            With Soumya & Srishty Properties Pvt. Ltd., finding your ideal property has never been easier. We combine modern technology with personalized service to make your home-buying journey smooth and stress-free.
          </p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaScreenpal className='text-green-400' />
              <p>
                Virtual Property Tours & Viewings – Explore homes from the comfort of your space.
              </p>
            </div>
            <div className='flex gap-3'>
              <FaUpDown className='text-green-400' />
              <p>Real-Time Market Price Updates – Stay informed about the latest property trends and prices.
              </p>
            </div>
            <div className='flex gap-3'>
              <FaMap className='text-green-400' />
              <p>Interactive Floor Plans & Maps – Visualize your future home before making a decision.
              </p>
            </div>
            <div className='flex gap-3'>
              <FaMapMarkedAlt className='text-green-400' />
              <p>Access to Off-Market Properties – Discover exclusive listings not available elsewhere.
              </p>
            </div>
            <div className='flex gap-3'>
              <FaEnvelope className='text-green-400' />
              <p>Direct Messaging with Agents & Owners  Communicate instantly for faster decisions and queries.</p>
            </div>
          </div>
        </div>

      </div>
      <div className='flex items-center flex-col lg:flex-row gap-12 mt-36'>

        <div className='flex-1'>
          <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'>Simplify Your Real Estate Journey Every Step of the Way</h2>
          <p>
            At Soumya & Srishty Properties Pvt. Ltd., we make buying or investing in property simple, transparent, and stress-free. Our platform and services are designed to guide you seamlessly from search to purchase.
          </p>
          <div className='flex flex-col gap-6 mt-5'>
            <div className='flex gap-3'>
              <FaList className='text-green-400' />
              <p>In-app scheduling for property viewings - Book visits effortlessly at your convenience.
</p>
            </div>
            <div className='flex gap-3'>
              <FaUpDown className='text-green-400' />
              <p>Real-Time Market Price Updates - Stay informed and make confident decisions.
</p>
            </div>
            <div className='flex gap-3'>
              <FaInbox className='text-green-400' />
              <p>User-Friendly Interface - Navigate listings and tools with ease.</p>
            </div>
            <div className='flex gap-3'>
              <FaUser className='text-green-400' />
              <p>Detailed Agent & Realtor Profiles - Connect with trusted professionals.
</p>
            </div>
            <div className='flex gap-3'>
              <FaMapMarkedAlt className='text-green-400' />
              <p>Access to Off-Market Properties - Discover exclusive opportunities before anyone else.</p>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <div className='relative flex justify-end'>

            <img src={about2} alt="AboutImg" className='rounded-3xl' />
            <span className='absolute top-8 right-8 bg-white px-2 rounded-full text-[14px] font-[500]'>Golden Coast</span>

          </div>
        </div>

      </div>
    </section>
  )
}

export default About
