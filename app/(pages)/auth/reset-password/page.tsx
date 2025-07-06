"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { resetPasswordConfirm } from "@/lib/api"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: email, 2: code and password
  const router = useRouter()
  const { toast } = useToast()

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // هنا يمكن إضافة دالة إرسال كود التحقق
      toast({
        title: "تم الإرسال",
        description: "تم إرسال كود التحقق إلى بريدك الإلكتروني"
      })
      setStep(2)
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إرسال الكود",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !newPassword || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await resetPasswordConfirm({ email, code, newPassword })
      toast({
        title: "تم بنجاح",
        description: "تم تغيير كلمة المرور بنجاح"
      })
      router.push("/auth/login")
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {step === 1 
                ? "أدخل بريدك الإلكتروني لإرسال كود التحقق"
                : "أدخل كود التحقق وكلمة المرور الجديدة"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-black"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={loading}
                >
                  {loading ? "جاري الإرسال..." : "إرسال كود التحقق"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="كود التحقق"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="border-black"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="كلمة المرور الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="border-black"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-black"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={loading}
                >
                  {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  العودة
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
