import { auth } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function layout({children}: {children: React.ReactNode}) {
    const session = await getServerSession(auth);
if (!session) {
 redirect('/login')
}    
  return (
    <div>
      {children}
    </div>
  )
}
