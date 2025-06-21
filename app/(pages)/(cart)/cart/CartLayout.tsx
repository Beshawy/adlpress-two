"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface ProductInCart {
  id: number;
  documentId: string;
  quantity: number;
  product: {
    id: number;
    documentId: string;
    name: string;
    price: number;
    discount?: number;
    count: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    image?: {
      id: number;
      documentId: string;
      name: string;
      url: string;
    };
    child_lasts?: { id: number; documentId: string; name: string }[];
  };
}

interface CartLayoutProps {
  children: React.ReactNode;
  productsInCart: ProductInCart[];
}

export default function CartLayout({ children, productsInCart }: CartLayoutProps) {
  const shipping = 50; // شحن
  const taxes = 50; // ضرائب

  // Calculate subtotal: price * quantity for each product
  const subtotal = productsInCart?.reduce(
    (total, item) => total + (item?.product?.price * item?.quantity),
    0
  ) || 0;

  // Total: subtotal + shipping + taxes
  const total = subtotal + shipping + taxes;

  return (
    <div className="my-20 grid lg:grid-cols-5 container mx-auto gap-x-10 px-4">
      <div className="space-y-4 lg:col-span-3">{children}</div>

      <div className="lg:col-span-2 relative">
        <div className="[&>*]:flex [&>*]:justify-between [&>*]:p-4 sticky top-24 end-0">
          <h1 className="text-lg md:text-xl font-bold">ملخص الطلب</h1>
          <p>
            <span>المجموع الفرعي</span>
            <span>{subtotal.toFixed(2)}$</span>
          </p>
          <p>
            <span>الشحن</span>
            <span>{shipping.toFixed(2)}$</span>
          </p>
          <p>
            <span>الضرائب</span>
            <span>{taxes.toFixed(2)}$</span>
          </p>
          <p className="border-t border-gray-200">
            <span>المجموع الكلي</span>
            <span>{total.toFixed(2)}$</span>
          </p>
          {subtotal > 0 && (
            <Link href="/checkout">
              <Button color="primary" className="w-full">
                <span className="w-full text-center py-10">إتمام الشراء</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}