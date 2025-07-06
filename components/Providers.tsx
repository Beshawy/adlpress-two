"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isTokenValid } from "@/lib/api";

// تعريف نوع بيانات المستخدم
interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user?: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkToken = () => {
      const isValid = isTokenValid();
      setIsLoggedIn(isValid);
    };

    // عند تحميل الصفحة
    checkToken();
    
    // تأخير بسيط للتأكد من تحديث localStorage
    const timeoutId = setTimeout(checkToken, 100);

    // عند أي تغيير في localStorage (حتى من نافذة أخرى)
    window.addEventListener("storage", checkToken);
    
    // الاستماع لحدث authStateChanged من المكونات الأخرى
    window.addEventListener("authStateChanged", checkToken);

    // مراقبة التغييرات المحلية (من نفس الصفحة)
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      if (key === "token") {
        setTimeout(checkToken, 0); // تأخير بسيط لضمان تحديث localStorage
      }
    };

    const origRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === "token") {
        setTimeout(checkToken, 0); // تأخير بسيط لضمان تحديث localStorage
      }
    };

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("authStateChanged", checkToken);
      // إعادة الدوال الأصلية
      localStorage.setItem = origSetItem;
      localStorage.removeItem = origRemoveItem;
    };
  }, []);

  // useEffect إضافي للتأكد من تحديث حالة تسجيل الدخول عند تغيير التوكن
  useEffect(() => {
    const handleAuthChange = () => {
      const isValid = isTokenValid();
      setIsLoggedIn(isValid);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </UserProvider>
    </SessionProvider>
  );
} 