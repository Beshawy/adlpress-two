"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderConfirmation() {
  const router = useRouter()

  useEffect(() => {
    // التحقق من وجود توكن
    // تم حذف أي تحويل تلقائي إلى /login
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-green-600">تم إرسال طلبك بنجاح!</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          شكراً لك على طلبك. سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">تفاصيل الطلب</h2>
          </div>
          <p className="text-gray-600">
            رقم الطلب: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p className="text-gray-600">
            تاريخ الطلب: {new Date().toLocaleDateString('ar-EG')}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/checkout')} 
            className="w-full py-3 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            العودة للصفحة الرئيسية
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/account/purchases')} 
            className="w-full py-3 text-lg"
          >
            <Package className="w-5 h-5 mr-2" />
            عرض طلباتي
          </Button>
        </div>
      </div>
    </div>
  )
}
