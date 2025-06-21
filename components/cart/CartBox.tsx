"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    getCartTotal,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col sm:max-w-lg pt-16">
        <SheetHeader>
          <SheetTitle>سلة التسوق</SheetTitle>
        </SheetHeader>
        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg">سلة التسوق فارغة.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-full items-start justify-between gap-4"
                  >
                    <div className="flex flex-1 items-start gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold break-words">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-red-500"
                      onClick={() => removeFromCart(item.id)}
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
                <Link href="/cart/checkout" passHref>
                  <Button className="w-full" onClick={toggleCart}>
                    إتمام الشراء
                  </Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartBox; 