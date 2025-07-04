"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({children}: {children: React.ReactNode}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // لا تفعل شيئاً أثناء التحميل
    
    if (!session) {
      router.push('/checkout');
    }
  }, [session, status, router]);

  // عرض loading أثناء التحقق من الجلسة
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
}
