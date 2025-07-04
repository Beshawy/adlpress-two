import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الملف الشخصي - Adlpress",
  description: "إدارة بيانات حسابك الشخصي",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 