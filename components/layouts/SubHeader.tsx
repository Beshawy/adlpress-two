import Image from 'next/image'
import React from 'react'
import { CategoryHeader } from './category-header'
import SubHeaderInput from './SubHeaderInput'

export default function SubHeader() {
  
  return (
    <div className="pt-6 -mt-16 h-96 flex flex-col justify-center items-center relative">
        <Image
          width={2500}
          height={2500}
          alt="header"
          src="/icons/header/bg.jpeg"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute bg-gray-950 bg-opacity-80 inset-0"></div>
        <div className='relative z-auto'>
          <CategoryHeader />
        </div>
        <div className="w-full flex justify-center items-center mt-10">
          <SubHeaderInput />
        </div>
      </div>
  )
}
