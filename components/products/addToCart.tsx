"use client";
import React, { useState } from "react";
import usePost from "@/hooks/use-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast"; // Optional: for user feedback
import { ShoppingCart } from "lucide-react";

interface AddToCartProps {
  productDocumentId: string; // The documentId of the product to add
}

export default function AddToCart({ productDocumentId }: AddToCartProps) {
  const { post, data, loading, error } = usePost("/carts");

  const handleAddToCart = async () => {
    try {
      const payload = {
        data: {     
          products: productDocumentId,
          quantity: 1,
        },
      };
      await post(payload);
      if (!error) {
        toast.success("تمت إضافة المنتج إلى السلة بنجاح!");
      }
    } catch (err) {
      toast.error("فشل إضافة المنتج إلى السلة");
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      size={"icon"}
      className="absolute -top-5 end-2 bg-white text-primary hover:text-white rounded-full"
    >
      <ShoppingCart className="size-8 md:size-5" />
    </Button>
  );
}
