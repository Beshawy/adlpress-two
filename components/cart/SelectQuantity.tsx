"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePut from "@/hooks/use-put";
import { toast } from "react-hot-toast"; // Optional: for feedback
import { Product } from "@/app/(pages)/products/[id]/page";

interface SelectQuantityProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  product: {
    product: Product;
    documentId: string;
    quantity: number;
  };
  onQuantityChange?: (documentId: string, quantity: number) => void; // Callback to update parent
}

export default function SelectQuantity({
  product,
  setRefresh,
  onQuantityChange,
}: SelectQuantityProps) {
  const { put, loading, error } = usePut(`/carts/${product.documentId}`);
  const handleQuantityChange = async (value: string) => {
    const newQuantity = parseInt(value, 10);

    try {
      await put({ data: { quantity: newQuantity } });
      setRefresh(prev=> !prev);
      if (!error && onQuantityChange) {
        onQuantityChange(product.documentId, newQuantity);
        toast.success("Quantity updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div>
      <Select
        defaultValue={`${product?.quantity}`}
        onValueChange={handleQuantityChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[90px]">
          <SelectValue placeholder={`${product?.quantity}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select a count</SelectLabel>
            {[1, 2, 3, 4, 5].map((item) => (
              <SelectItem key={item} value={`${item}`}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
