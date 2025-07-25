import React from 'react'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side (Text shifted towards right) */}
      <div className='w-full sm:w-1/2 flex items-center justify-end pr-8 py-10 sm:py-0'>
        <div className='text-[#414141] max-w-md'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>WEAR & WOW</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Roz ka Fashion , Roz ka Wow</h1>
          
          {/* SHOP NOW button with Link */}
          <Link to="/collection">
            <div className='flex items-center gap-2 cursor-pointer'>
              <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
              <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Right Side (Image aligned to far right) */}
      <div className='w-full sm:w-1/2 flex items-center justify-end'>
        <img className='max-w-full max-h-[500px] object-contain' src="/Hero.png" alt="Showcase of latest arrivals" />
      </div>
    </div>
  )
}

export default Hero

