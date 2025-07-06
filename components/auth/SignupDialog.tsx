"use client";

import { useState } from "react";
import { register, initiateGoogleAuth } from "@/lib/api";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupDialog({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("جميع الحقول مطلوبة");
      return;
    }
    if (password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("يرجى إدخال عنوان بريد إلكتروني صالح");
      return;
    }
    if (!termsAccepted) {
      setError("يجب أن توافق على شروط الخدمة وسياسة الخصوصية");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await register({ username, email, password });
      setError(null);
      // إظهار رسالة نجاح
      alert("تم إنشاء الحساب بنجاح! سيتم تحويلك لتسجيل الدخول.");
      // تحويل المستخدم لصفحة تسجيل الدخول
      onSwitchToLogin();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      initiateGoogleAuth();
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || "حدث خطأ في التسجيل بواسطة Google");
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="px-6 py-0 flex flex-col items-center">
      <DialogHeader className="mb-8 text-center pt-5">
        <DialogTitle className="text-3xl font-bold">إنشاء حساب</DialogTitle>
      </DialogHeader>
      <div className="w-full space-y-4 pb-4">
        <div className="space-y-2">
          <Label htmlFor="username-signup" className="text-xl font-medium">
            اسم المستخدم
          </Label>
          <Input
            id="username-signup"
            placeholder="أدخل اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-14 text-lg text-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-signup" className="text-xl font-medium">
            البريد الإلكتروني
          </Label>
          <Input
            id="email-signup"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 text-lg text-gray-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-signup" className="text-xl font-medium">
            كلمة المرور
          </Label>
          <Input
            id="password-signup"
            type="password"
            placeholder="يجب أن تكون الكلمة 8 أحرف على الأقل"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 text-lg text-gray-500"
          />
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="terms" className="text-sm font-normal">
            بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.
          </Label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading || !termsAccepted}
          className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg"
        >
          {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
        
        {/* فاصل */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>
        
        {/* زر Google */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          variant="outline"
          className="w-full py-6 text-lg border-2 hover:bg-gray-50"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "جارٍ التوجيه..." : "إنشاء حساب بواسطة Google"}
          </div>
        </Button>
        
        <div className="text-center pt-4">
          <p className="text-gray-500">
            لديك حساب بالفعل؟{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-blue-600 font-medium">
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}