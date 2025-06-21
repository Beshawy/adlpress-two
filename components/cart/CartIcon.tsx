"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "../ui/badge";

const CartIcon = () => {
  const { cartItems, toggleCart } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center justify-center rounded-full p-2 transition-colors hover:bg-yellow-400 dark:hover:bg-yellow-500"
    >
      <ShoppingCart className="h-6 w-6 text-white" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </button>
  );
};

export default CartIcon; 