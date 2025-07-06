"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // الحصول على معاملات الاستعلام
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    console.log('Auth redirect params:', { code: !!code, error, state })

    if (error) {
      // إذا كان هناك خطأ، توجيه لصفحة callback مع الخطأ
      router.push(`/auth/callback?error=${encodeURIComponent(error)}`)
      return
    }

    if (code) {
      // إذا كان هناك كود، توجيه لصفحة callback مع الكود
      router.push(`/auth/callback?code=${encodeURIComponent(code)}`)
      return
    }

    // إذا لم يكن هناك كود ولا خطأ، توجيه للصفحة الرئيسية
    router.push('/')
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">جاري التوجيه...</h1>
        <p className="text-gray-600">يرجى الانتظار</p>
      </div>
    </div>
  )
} 