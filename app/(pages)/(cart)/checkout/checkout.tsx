"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  country: z.string().min(1, "الدولة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  address: z.string().min(1, "العنوان مطلوب"),
  paymentMethod: z.enum(["visa", "fawry", "vodafone"]),
});

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      paymentMethod: "visa",
    },
  });

  const onSubmit = async (values: any) => {
    // فقط رسالة وهمية بدون أي اتصال API
    toast({ title: "تم الطلب (عرض تجريبي فقط)" });
    router.push("/success");
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-xl shadow-lg border border-yellow-400">
      <h2 className="text-3xl font-bold mb-6 text-yellow-500">إتمام الشراء</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl><Input {...field} placeholder="أدخل اسمك" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl><Input {...field} placeholder="example@email.com" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="phone" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl><Input {...field} placeholder="01000000000" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="country" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>الدولة</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مصر" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="city" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>المدينة</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="القاهرة" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="العنوان بالتفصيل" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="space-y-4">
            <FormField name="paymentMethod" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الدفع</FormLabel>
                <FormControl>
                  <RadioGroup {...field} value={field.value} onValueChange={field.onChange} className="flex flex-col gap-3">
                    <RadioGroupItem value="visa" id="visa" />
                    <FormLabel htmlFor="visa">بطاقة فيزا/ماستر كارد</FormLabel>
                    <RadioGroupItem value="fawry" id="fawry" />
                    <FormLabel htmlFor="fawry">فوري</FormLabel>
                    <RadioGroupItem value="vodafone" id="vodafone" />
                    <FormLabel htmlFor="vodafone">فودافون كاش</FormLabel>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold mb-2">
                <span>الإجمالي:</span>
                <span>{getCartTotal()} جنيه</span>
              </div>
              <Button type="submit" className="w-full mt-4">إتمام الطلب</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutPage; 