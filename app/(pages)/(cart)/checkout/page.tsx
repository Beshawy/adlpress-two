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
import { addOrder, isTokenValid } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const formSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال عنوان بريد إلكتروني صالح" }),
  phone: z.string().min(11, { message: "يجب أن يتكون رقم الهاتف من 11 رقمًا على الأقل" }),
  name: z.string().min(2, { message: "يجب أن يتكون الاسم من حرفين على الأقل" }),
  country: z.string().min(1, { message: "الرجاء تحديد بلد" }),
  city: z.string().min(1, { message: "الرجاء تحديد مدينة" }),
  address: z.string().min(5, { message: "يجب أن يتكون العنوان من 5 أحرف على الأقل" }),
  defaultAddress: z.boolean().optional(),
  paymentMethod: z.string().min(1, { message: "الرجاء تحديد طريقة دفع" }),
})

export default function CheckoutForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { toast } = useToast()

  // التحقق من وجود التوكن وحالة تسجيل الدخول
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      // أزل أي تحويل تلقائي إلى /login
      if (!token) {
        toast({
          title: "يجب تسجيل الدخول أولاً",          description: "يرجى تسجيل الدخول لإتمام الطلب",
          variant: "destructive"
        });
        return;
      }
      const isValid = isTokenValid();
      if (!isValid) {
        toast({
          title: "توكن الدخول غير صالح",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive"
        });
        return;
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      name: "",
      country: "Egypt",
      city: "Cairo",
      address: "",
      defaultAddress: false,
      paymentMethod: "card",
    },
  })

  const paymentMethods = [
    {
      id: "card",
      label: "بطاقة الائتمان / الخصم المباشر",
      img: "/icons/payment/card.png",
    },
    {
      id: "fawry",
      label: "فوري",
      img: "/icons/payment/fawry.png",
    },
    {
      id: "instapay",
      label: "انستا باي",
      img: "/icons/payment/instapay.png",
    },
    {
      id: "orange",
      label: "أورانج كاش",
      img: "/icons/payment/orange-money.png",
    },
    {
      id: "vodafone",
      label: "فودافون كاش",
      img: "/icons/payment/vodafone.png",
    },
    {
      id: "etisalat",
      label: "اتصالات كاش",
      img: "/icons/payment/etisalat.png",
    },
  ]

  // التحقق من وجود منتجات في السلة
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">سلة التسوق فارغة</h1>
        <p className="text-lg mb-6">لا توجد منتجات في السلة لإتمام عملية الشراء</p>
        <Button onClick={() => router.push('/')} className="px-8">
          العودة للتسوق
        </Button>
      </div>
    )
  }

  // عرض شاشة التحميل أثناء فحص تسجيل الدخول
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">جاري التحقق من تسجيل الدخول...</p>
      </div>
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const orderData = {
        customerInfo: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: {
            country: values.country,
            city: values.city,
            address: values.address,
            defaultAddress: values.defaultAddress
          }
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentMethod: values.paymentMethod,
        totalAmount: getCartTotal(),
        orderDate: new Date().toISOString(),
        status: 'pending'
      }

      const response = await addOrder(orderData)
      
      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب"
      })

      clearCart()

      router.push("/checkout/last")
      
    } catch (error: any) {
      console.error('Order submission error:', error)
      toast({
        title: "خطأ في إرسال الطلب",
        description: error.message || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h1 className="text-3xl font-bold mb-6">معلومات الاتصال</h1>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="user@gmail.com" {...field} className="p-4 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl">رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الهاتف" {...field} className="p-4 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl">الاسم</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم" {...field} className="p-4 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-3xl font-bold mb-6">عنوان الشحن</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl">البلد</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="p-3 text-base">
                                <SelectValue placeholder="اختر دولة">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-5 bg-red-600 relative overflow-hidden">
                                      <div className="absolute inset-0 flex flex-col">
                                        <div className="h-1/3 bg-red-600"></div>
                                        <div className="h-1/3 bg-white"></div>
                                        <div className="h-1/3 bg-black"></div>
                                      </div>
                                    </div>
                                    <span>مصر</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Egypt">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-5 bg-red-600 relative overflow-hidden">
                                    <div className="absolute inset-0 flex flex-col">
                                      <div className="h-1/3 bg-red-600"></div>
                                      <div className="h-1/3 bg-white"></div>
                                      <div className="h-1/3 bg-black"></div>
                                    </div>
                                  </div>
                                  <span>مصر</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="UAE">الإمارات</SelectItem>
                              <SelectItem value="Saudi Arabia">السعودية</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl">المدينة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="p-3 text-base">
                                <SelectValue placeholder="اختر مدينة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Cairo">القاهرة</SelectItem>
                              <SelectItem value="Alexandria">الإسكندرية</SelectItem>
                              <SelectItem value="Giza">الجيزة</SelectItem>
                              <SelectItem value="Sharm El Sheikh">شرم الشيخ</SelectItem>
                              <SelectItem value="Luxor">الأقصر</SelectItem>
                              <SelectItem value="Aswan">أسوان</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl">العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="مدينة نصر" {...field} className="p-4 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultAddress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 mt-1 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-normal">تعيين كعنوان شحن افتراضي</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              {/* Payment */}
              <div>
                <h2 className="text-3xl font-bold mb-6">الدفع</h2>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center gap-3">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={method.id} id={method.id} className="h-6 w-6" />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 flex items-center justify-center">
                                    <img src={method.img || "/placeholder.svg"} alt={method.label} className="h-6 w-6" />
                                  </div>
                                  <FormLabel className="text-xl font-normal" htmlFor={method.id}>
                                    {method.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg mt-8" disabled={isSubmitting}>
                {isSubmitting ? "جارٍ المتابعة..." : "المتابعة إلى الدفع"}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* ملخص الطلب */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>
          
          {/* المنتجات */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-gray-500 text-sm">الكمية: {item.quantity}</p>
                  <p className="text-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* الإجمالي */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">الشحن</span>
              <span>مجاناً</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>الإجمالي</span>
              <span className="text-primary">${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
