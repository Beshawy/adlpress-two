"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordConfirm } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);
    try {
      await resetPasswordConfirm({ token, password });
      setMsg("تم تحديث كلمة المرور بنجاح! سيتم تحويلك لتسجيل الدخول...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-12 flex flex-col items-center max-w-md mx-auto">
      <DialogHeader className="mb-8 text-center">
        <DialogTitle className="text-2xl font-bold">إعادة تعيين كلمة المرور</DialogTitle>
      </DialogHeader>
      <div className="w-full space-y-4">
        <Input
          type="password"
          placeholder="أدخل كلمة المرور الجديدة"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="h-14 text-lg text-gray-500"
          required
        />
        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={loading || !password} className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg">
          {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
        </Button>
      </div>
    </form>
  );
} 