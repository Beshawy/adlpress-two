"use client"
import { Loader2 } from 'lucide-react'
import React from 'react'

export default function LoadingPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex gap-4 flex-col items-center text-xl font-bold'>
        <Loader2 className='size-12 md:size-24 animate-spin text-gray-700'/>
        <span>Loading..</span>
      </div>
    </div>
  )
}
