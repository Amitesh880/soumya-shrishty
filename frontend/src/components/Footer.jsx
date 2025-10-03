import React from 'react'
import { FaMailBulk, FaPhone } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"

const Footer = () => {
  return (
   <footer>
    <div className='mx-auto  px-6 lg:px-12 flex items-start justify-between flex-col lg:flex-row gap-8 py-5 mb-7 bg-gradient-to-r from-yellow-200 via-white to-white'>
      <div>
        <h4 className='text-[16px] md:text-[17px] mb-2 font-bold'>We are always here to help</h4>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus, voluptatum.</p>
      </div>
      <div className='flex items-center justify-start flex-wrap gap-8'>
        <div className='flex items-center justify-center gap-x-6'>
          <FaLocationDot />
          <div>
            <h5 className='text-[14px] md:text-[15px] mb-1 font-bold'>Location</h5>
              <p>123,Avenue,Cl</p>
         
          </div>
        </div>
        <div className='flex items-center justify-center gap-x-6'>
          <FaPhone />
          <div>
            <h5 className='text-[14px] md:text-[15px] mb-1 font-bold'>Phone</h5>
              <p>+0123456789</p>
         
          </div>
        </div>
        <div className='flex items-center justify-center gap-x-6'>
          <FaMailBulk />
          <div>
            <h5 className='text-[14px] md:text-[15px] mb-1 font-bold'>Email Support</h5>
              <p>info@zenhomes.com</p>
         
          </div>
        </div>
      </div>
    </div>
      <div className='mx-auto  px-6 lg:px-12 flex items-start justify-between flex-wrap gap-12 mt-12'>
            {/* logo - Left side */}
            <div className='flex flex-col max-w-sm gap-y-5'>
              {/* logo */}
              <div>
                <Link to={"/"}>
                  <img src={logo} alt="" className="h-16" />
                </Link>
              </div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas earum reprehenderit possimus!</p>
            </div>
            <div className='flex items-center justify-start gap-7 xl:gap-x-36 flex-wrap'>
              <ul>
                <h4 className='text-[16px] md:text-[17px]  font-bold mb-3'>Customer Service</h4>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Help center</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Payment methods</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Contact</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Shipping status</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Complaints</a></li>
              </ul>
              <ul>
                <h4 className='text-[16px] md:text-[17px]  font-bold mb-3'>Legal</h4>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Privacy Policy</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Cookie settings</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Terms & conditions</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Cancelation</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Imprint</a></li>
              </ul>
              <ul>
                <h4 className='text-[16px] md:text-[17px]  font-bold mb-3'>Others</h4>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Our teams</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Sustainability</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Press</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Jobs</a></li>
                <li className='my-2'><a href="" className='text-gray-30 text-[14px] font-[400] '>Newsletter</a></li>
              </ul>
            </div>
          </div>
          {/* copyrights */}
          <p className='mx-auto  lg:px-12 text-[14px] font-[500] py-2 px-8 rounded flex items-center justify-between mt-6 bg-gradient-to-r from-yellow-200 via-white to-white'><span>2025 ZenHomes</span><span>All rights reserved</span></p>
    
   </footer>
  )
}

export default Footer
