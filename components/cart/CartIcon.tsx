"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "../ui/badge";

const CartIcon = ({ color }: { color?: string }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <span className="relative flex items-center justify-center">
      <ShoppingCart className={`h-6 w-6 ${color === 'white' ? 'text-white' : color === 'black' ? 'text-black' : 'text-primary lg:text-white dark:text-yellow-400'}`} />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </span>
  );
};

export default CartIcon; 