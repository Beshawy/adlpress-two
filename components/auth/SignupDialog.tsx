"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
      const result = await signIn("register", {
        redirect: false,
        username,
        email,
        password,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.reload(); // Redirect on success
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
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
            placeholder="أدخل كلمة المرور"
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