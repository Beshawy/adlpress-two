"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const CheckoutPage = () => {
  const router = useRouter()
  const { cartItems, getCartTotal } = useCart()
  const { toast } = useToast()

  const formSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    country: z.string().min(1, "الدولة مطلوبة"),
    city: z.string().min(1, "المدينة مطلوبة"),
    address: z.string().min(1, "العنوان مطلوب"),
    paymentMethod: z.enum(["visa", "fawry", "vodafone"]),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      paymentMethod: "visa" as const,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const orderData = {
        ...values,
        items: cartItems,
        total: getCartTotal(),
      }
      
      // هنا يمكن إضافة منطق إرسال الطلب للخادم
      console.log("بيانات الطلب:", orderData)
      
      toast({
        title: "تم الطلب بنجاح",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب"
      })
      
      // الانتقال إلى صفحة النجاح أو الصفحة الرئيسية
      router.push("/")
    } catch (error: any) {
      toast({
        title: "حدث خطأ أثناء إرسال الطلب",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // التحقق من وجود منتجات في السلة
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/")
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة أولاً",
        variant: "destructive"
      })
    }
  }, [cartItems, router, toast])

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg border border-yellow-400 p-8">
          <h2 className="text-3xl font-bold mb-6 text-yellow-500 text-center">إتمام الشراء</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* نموذج البيانات الشخصية */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="أدخل اسمك" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="example@email.com" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="01xxxxxxxxx" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="country"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الدولة</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="مصر" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="city"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="القاهرة" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name="address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان التفصيلي</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="الشارع، الحي، الرمز البريدي" className="border-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormLabel>طريقة الدفع</FormLabel>
                    <FormField
                      name="paymentMethod"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="visa" id="visa" />
                                <label htmlFor="visa" className="flex items-center gap-2">
                                  <Image
                                    src="/icons/payment/card.png"
                                    alt="Visa"
                                    width={40}
                                    height={25}
                                    className="object-contain"
                                  />
                                  <span>بطاقة ائتمان</span>
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="fawry" id="fawry" />
                                <label htmlFor="fawry" className="flex items-center gap-2">
                                  <Image
                                    src="/icons/payment/fawry.png"
                                    alt="Fawry"
                                    width={40}
                                    height={25}
                                    className="object-contain"
                                  />
                                  <span>فوري</span>
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border rounded-lg p-4">
                                <RadioGroupItem value="vodafone" id="vodafone" />
                                <label htmlFor="vodafone" className="flex items-center gap-2">
                                  <Image
                                    src="/icons/payment/vodafone.png"
                                    alt="Vodafone"
                                    width={40}
                                    height={25}
                                    className="object-contain"
                                  />
                                  <span>فودافون كاش</span>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    إتمام الطلب
                  </Button>
                </form>
              </Form>
            </div>

            {/* ملخص الطلب */}
            <div className="bg-gray-50 rounded-lg p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
              
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 border-b pb-3">
                    {item.product.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.name || "منتج"}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name || "منتج بدون اسم"}</p>
                      <p className="text-gray-500 text-sm">${item.product.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-yellow-600">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage 