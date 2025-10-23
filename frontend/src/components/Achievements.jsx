import React,{ useState,useEffect } from 'react'
import CountUp from 'react-countup';
import { LiaCertificateSolid } from 'react-icons/lia';

const Achievements = () => {
    const[IsVisible,setIsVisible]=useState(false);
    const statistics=[
        {label: "Happy clients",value:12},
        {label: "Different cities",value:3},
        {label: "Projects completed",value:45},
    ]
    useEffect(()=>{
        const handleScroll=()=>{
            const aboutSection=document.getElementById('about');
            if(aboutSection){
                const top=aboutSection.getBoundingClientRect().top;
                const IsVisible=top<window.innerHeight-100;
                setIsVisible(IsVisible)
            }
        }
        window.addEventListener("scroll",handleScroll)
        return()=>{
            window.removeEventListener("scroll",handleScroll)
        }
    },[])
  return (
  <section id='about' className='mx-auto '>
    <div className=' flex flex-col xl:flex-row'>
        <div className='flex-[6] flex justify-center flex-col bg-[#008274] text-white px-6 lg:px-12 py-16'>
            <h2 className='text-[41px] leading-tight md:text-[49px] md:leading-[1.3] mb-4 font-bold'> Our Achievements </h2>
            <p className='py-5 text-white max-w-[47rem]'>With over 11 years of dedicated service, we have successfully delivered exceptional real estate solutions to our valued clients. Our commitment and expertise have allowed us to grow steadily and make a difference in every project we undertake.</p>
            <div className='flex flex-wrap gap-4'>
                {statistics.map((statistic,index)=>(
                  <div key={index} className='p-4 rounded-lg'>
                    <div className='flex items-center gap-1'>
                        <CountUp start={IsVisible ? 0:null}end={statistic.value} duration={10} delay={1}>
                     {({countUpRef})=>(
                        <h3 ref={countUpRef} className='text-5xl font-sans'></h3>
                        )}
                        </CountUp>
                        <h4 className='text-[32px] font-[400]'>k+</h4>

                    </div>
                    <p className='text-white capitalize pt-2'>{statistic.label}</p>
                    </div>

                ))}
        </div>
    </div>
    <div className='flex-[4] relative bg-yellow-100 px-6 lg:px-12 py-16 '>
        <div className='p-4 rounded-lg flex items-center justify-center flex-col '>
            <span className='relative bottom-8  p-3 flex items-center rounded-full '><LiaCertificateSolid className='text-5xl text-black'/></span>
            <span className='relative bottom-3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis atque dolorum totam aliquid!</span>
        </div>
    </div>
    </div>
  </section>
  )
}

export default Achievements
