"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserOrders } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Package, Calendar, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PurchasesPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthAndLoadOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      try {
        const userOrders = await getUserOrders()
        setOrders(userOrders)
      } catch (error: any) {
        toast({
          title: "خطأ في تحميل الطلبات",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadOrders()
  }, [router, toast])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">طلباتي</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
          <p className="text-gray-600 mb-6">لم تقم بأي طلب بعد</p>
          <Button onClick={() => router.push('/')}>
            التسوق الآن
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">طلب #{order._id?.slice(-8) || index + 1}</h3>
                  <p className="text-gray-600">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {order.items?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        الكمية: {item.quantity} × ${item.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{order.customerInfo?.address?.city}, {order.customerInfo?.address?.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
