"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// تعريف نوع بيانات المستخدم
interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user?: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // عند تحميل الصفحة
    checkToken();

    // عند أي تغيير في localStorage (حتى من نافذة أخرى)
    window.addEventListener("storage", checkToken);

    // مراقبة التغييرات المحلية (من نفس الصفحة)
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      origSetItem.apply(this, arguments);
      if (key === "token") checkToken();
    };

    const origRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === "token") checkToken();
    };

    return () => {
      window.removeEventListener("storage", checkToken);
      // ملاحظة: في تطبيقات الإنتاج يفضل إعادة setItem/removeItem الأصليين هنا إذا كان هناك احتمال إعادة تحميل أو unmount
    };
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