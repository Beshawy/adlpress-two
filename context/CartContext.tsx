"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import { addOrder, deleteOrder, getUserOrders, getProduct } from "@/lib/api";

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

  // جلب السلة من الباك اند عند بدء التطبيق
  useEffect(() => {
    refreshCart();
  }, []);

  // حفظ السلة في localStorage للسرعة فقط
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // جلب السلة من الباك اند
  const refreshCart = async () => {
    try {
      const response = await getUserOrders();
      console.log('🟢 getUserOrders response:', response);
      let orders = Array.isArray(response) ? response : [];
      console.log('🟡 orders after extraction:', orders);
      let items: CartItem[] = [];
      if (Array.isArray(orders)) {
        items = await Promise.all(
          orders.map(async (order: any) => {
            let productId = typeof order.product === "string"
              ? order.product
              : order.product?._id || order.product?.id;
            let productData = null;
            try {
              productData = await getProduct(productId);
            } catch {
              productData = { _id: productId, name: "منتج بدون اسم", price: 0, image: "" };
            }
            return {
              orderId: order._id,
              product: {
                _id: productData._id,
                name: productData.name || productData.title?.ar || "منتج بدون اسم",
                price: productData.price || 0,
                image: productData.image?.[0]?.url || "",
              },
            };
          })
        );
      }
      console.log('🔵 items after build:', items);
      setCartItems(items);
      setTimeout(() => {
        console.log('🟣 cartItems after set:', items);
      }, 500);
    } catch (error) {
      setCartItems([]);
    }
  };

  // إضافة منتج للسلة (مرة واحدة فقط)
  const addToCart = async (product: { _id: string; name: string; price: number; image: string }) => {
    console.log('🟠 addToCart called with:', product);
    // تحقق إذا كان المنتج موجود بالفعل
    if (cartItems.some((item) => item.product._id === product._id)) {
      setIsCartOpen(true); // فقط افتح السلة
      return;
    }
    try {
      await addOrder({ product: product._id });
      await refreshCart();
    } catch (error: any) {
      // إذا كان الخطأ بسبب وجود المنتج بالفعل، جلب السلة من الباك اند
      if (error?.response?.data?.message?.includes("Order already exists")) {
        await refreshCart();
        setIsCartOpen(true);
      }
      // يمكن عرض رسالة خطأ هنا إذا أردت
    }
  };

  // حذف منتج من السلة
  const removeFromCart = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setCartItems((prev) => prev.filter((item) => item.orderId !== orderId));
    } catch (error) {
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
    refreshCart();
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