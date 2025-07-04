import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordRequest, resetPasswordConfirm } from "@/lib/api";

export default function ForgotPasswordDialog({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // إرسال كود التحقق
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      await resetPasswordRequest(email);
      setMsg("تم إرسال كود التحقق إلى بريدك الإلكتروني.");
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال الكود");
    } finally {
      setLoading(false);
    }
  };

  // تحقق وتعيين كلمة المرور الجديدة
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      await resetPasswordConfirm({ email, code, newPassword: password });
      setMsg("تم تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.");
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-8">
      <DialogHeader className="mb-8 text-center flex justify-center items-center">
        <DialogTitle className="text-2xl font-bold w-full text-center">تعيين كلمة مرور جديدة</DialogTitle>
      </DialogHeader>
      {step === "request" ? (
        <form onSubmit={handleRequest} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="forgot-email" className="text-right text-base font-medium text-gray-700">البريد الإلكتروني</label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-16 text-xl text-gray-900 border-2 border-black focus:border-black focus:ring-0 bg-white rounded-lg shadow-lg px-5 font-bold placeholder-gray-400 transition-all duration-200"
            />
          </div>
          {msg && <p className="text-green-600 text-sm text-center">{msg}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" disabled={loading || !email} className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-md shadow">
            {loading ? "جارٍ الإرسال..." : "إرسال كود التحقق"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            id="verify-code"
            type="text"
            placeholder="كود التحقق"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="h-16 text-xl text-gray-900 border-2 border-black focus:border-black focus:ring-0 bg-white rounded-lg shadow-lg px-5 font-bold placeholder-gray-400 transition-all duration-200"
          />
          <Input
            id="verify-email"
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="h-16 text-xl text-gray-900 border-2 border-black focus:border-black focus:ring-0 bg-white rounded-lg shadow-lg px-5 font-bold placeholder-gray-400 transition-all duration-200"
          />
          <Input
            id="verify-password"
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="h-16 text-xl text-gray-900 border-2 border-black focus:border-black focus:ring-0 bg-white rounded-lg shadow-lg px-5 font-bold placeholder-gray-400 transition-all duration-200"
          />
          {msg && <p className="text-green-600 text-sm text-center">{msg}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" disabled={loading || !code || !email || !password} className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-md shadow">
            {loading ? "جارٍ التعيين..." : "تعيين كلمة المرور"}
          </Button>
        </form>
      )}
    </div>
  );
} 