"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import { addToOrder, deleteOrder, getUserOrders } from "@/lib/api";

// CartItem الجديد يحمل orderId وبيانات المنتج
export interface CartItem {
  orderId: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

// Define the shape of the context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { _id: string; name: string; price: number; image: string }) => Promise<void>;
  removeFromCart: (orderId: string) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  refreshCart: () => Promise<void>;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // فحص تسجيل الدخول
  const isLoggedIn = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

  // جلب السلة من الباك اند عند بدء التطبيق وعند تغيير حالة تسجيل الدخول
  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isLoggedIn]);

  // مراقبة تغييرات حالة تسجيل الدخول
  useEffect(() => {
    const handleAuthChange = () => {
      const currentLoginState = !!localStorage.getItem('token');
      if (currentLoginState !== isLoggedIn) {
        // سيتم إعادة تشغيل useEffect أعلاه تلقائياً
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [isLoggedIn]);

  // حفظ السلة في localStorage للسرعة فقط
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // جلب السلة من الباك اند
  const refreshCart = async () => {
    // تحقق من تسجيل الدخول أولاً
    if (!isLoggedIn) {
      console.log('🔒 المستخدم غير مسجل دخول، لن يتم جلب السلة');
      setCartItems([]);
      return;
    }

    try {
      const response = await getUserOrders();
      console.log('🟢 getUserOrders response:', response);
      let orders = Array.isArray(response) ? response : [];
      console.log('🟡 orders after extraction:', orders);
      let items: CartItem[] = [];
      if (Array.isArray(orders)) {
        items = orders.map((order: any) => {
          return {
            orderId: order.id,
            product: {
              _id: order.id,
              name: order.title?.ar || order.title?.en || "منتج بدون اسم",
              price: order.price || 0,
              image: order.image?.[0]?.url || "",
            },
          };
        });
      }
      console.log('🔵 items after build:', items);
      setCartItems(items);
      setTimeout(() => {
        console.log('🟣 cartItems after set:', items);
      }, 500);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      setCartItems([]);
    }
  };

  // إضافة منتج للسلة (مرة واحدة فقط)
  const addToCart = async (product: { _id: string; name: string; price: number; image: string }) => {
    console.log('🟠 addToCart called with:', product);
    
    // تحقق من تسجيل الدخول أولاً
    if (!isLoggedIn) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }
    
    // تحقق من وجود بيانات المنتج وصحة الـ id
    if (!product || !product._id) {
      console.error('🚫 لا يمكن إضافة منتج غير معرف أو بدون id للسلة:', product);
      return;
    }
    console.log('🟠 سيتم إرسال هذا الـ id إلى addToOrder:', product._id);
    // تحقق إذا كان المنتج موجود بالفعل
    if (cartItems.some((item) => item.product._id === product._id)) {
      setIsCartOpen(true); // فقط افتح السلة
      return;
    }
    try {
      await addToOrder(product._id);
      await refreshCart();
      
      // إرسال حدث لتحديث العداد في الهيدر
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      // إذا كان الخطأ بسبب وجود المنتج بالفعل، جلب السلة من الباك اند
      if (error?.response?.data?.message?.includes("Order already exists") || 
          error?.message?.includes("Order already exists")) {
        await refreshCart();
        setIsCartOpen(true);
        
        // إرسال حدث لتحديث العداد في الهيدر
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
      // يمكن عرض رسالة خطأ هنا إذا أردت
    }
  };

  // حذف منتج من السلة
  const removeFromCart = async (orderId: string) => {
    // تحقق من تسجيل الدخول أولاً
    if (!isLoggedIn) {
      console.log('🔒 المستخدم غير مسجل دخول، لن يتم حذف المنتج');
      return;
    }
    
    try {
      await deleteOrder(orderId);
      setCartItems((prev) => prev.filter((item) => item.orderId !== orderId));
      
      // إرسال حدث لتحديث العداد في الهيدر
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing from cart:', error);
      // يمكن عرض رسالة خطأ هنا
    }
  };

  // تفريغ السلة (حذف كل الطلبات)
  const clearCart = () => {
    setCartItems([]);
    // يمكن لاحقاً عمل حذف جماعي من الباك اند إذا توفر endpoint
  };

  // حساب الإجمالي
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price || 0), 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openCart = () => {
    setIsCartOpen(true);
    if (isLoggedIn) {
      refreshCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        isCartOpen,
        toggleCart,
        openCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}; 