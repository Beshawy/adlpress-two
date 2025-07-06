"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { handleGoogleCallback } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // الحصول على كود الاستجابة من URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          setStatus('error')
          setErrorMessage('حدث خطأ في عملية المصادقة مع Google')
          return
        }

        if (!code) {
          console.error('No authorization code received')
          setStatus('error')
          setErrorMessage('لم يتم استلام رمز المصادقة من Google')
          return
        }

        console.log('Received authorization code:', code)

        // إرسال الكود للسيرفر
        const response = await handleGoogleCallback(code)
        
        if (response.token) {
          // حفظ بيانات المستخدم إذا كانت موجودة
          if (response.user) {
            if (response.user._id || response.user.id) {
              localStorage.setItem('userId', response.user._id || response.user.id);
            }
            if (response.user.username) {
              localStorage.setItem('username', response.user.username);
            }
          }
          
          // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
          window.dispatchEvent(new Event('authStateChanged'));
          
          setStatus('success')
          
          toast({
            title: "تم تسجيل الدخول بنجاح!",
            description: "سيتم تحويلك للصفحة المطلوبة"
          })

          // التوجيه للصفحة المطلوبة
          setTimeout(() => {
            const returnUrl = localStorage.getItem('returnUrl') || '/'
            localStorage.removeItem('returnUrl')
            router.push(returnUrl)
          }, 2000)
        } else {
          throw new Error('لم يتم استلام توكن صالح من الخادم')
        }

      } catch (error: any) {
        console.error('Callback handling error:', error)
        setStatus('error')
        setErrorMessage(error.message || 'حدث خطأ غير متوقع')
      }
    }

    handleCallback()
  }, [searchParams, router, toast])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">جاري معالجة تسجيل الدخول...</h1>
          <p className="text-gray-600">يرجى الانتظار بينما نتحقق من بياناتك</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-green-600">تم تسجيل الدخول بنجاح!</h1>
          <p className="text-gray-600 mb-6">سيتم تحويلك للصفحة المطلوبة قريباً</p>
          <Button onClick={() => router.push('/')}>
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-red-600">حدث خطأ</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <Button onClick={() => router.push('/')}>
              العودة للصفحة الرئيسية
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
} 