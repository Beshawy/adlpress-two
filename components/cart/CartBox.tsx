"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";

const CartBox = () => {
  const router = useRouter();
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    removeFromCart,
    addToCart,
    getCartTotal,
    refreshCart,
    openCart,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      refreshCart();
    }
  }, [isCartOpen, refreshCart]);

  const handleCheckout = () => {
    // التحقق من وجود منتجات في السلة
    if (cartItems.length === 0) {
      console.log("السلة فارغة، لا يمكن الانتقال إلى الفوترة");
      return;
    }

    // إغلاق السلة أولاً
    toggleCart();
    
    // الانتقال إلى صفحة الفوترة
    console.log("الانتقال إلى صفحة الفوترة...");
    router.push("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col sm:max-w-lg pt-16">
        <SheetHeader>
          <SheetTitle className="mt-6 sm:mt-0">سلة التسوق</SheetTitle>
        </SheetHeader>
        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">سلة التسوق فارغة.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-6">
                {cartItems.map((item, idx) => (
                  <div
                    key={(item.orderId && item.product._id) ? (item.orderId + '-' + item.product._id) : 'cartitem-' + idx}
                    className="flex w-full items-start justify-between gap-4"
                  >
                    <div className="flex flex-1 items-start gap-4">
                      {/* عرض الصورة فقط إذا كانت موجودة */}
                      {item.product.image ? (
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name || "منتج بدون اسم"}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-md"
                          />
                        </div>
                      ) : null}
                      <div className="flex-1">
                        <p className="font-semibold break-words">
                          {item.product.name && item.product.name !== "منتج بدون اسم"
                            ? item.product.name
                            : "منتج بدون اسم"}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-red-500"
                      onClick={() => removeFromCart(item.orderId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter>
              <div className="w-full border-t pt-4">
                <div className="flex justify-between font-bold text-lg my-4">
                  <span>الإجمالي</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                   <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  إتمام الشراء
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartBox; 