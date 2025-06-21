"use client";
import { ProductType } from "@/@types/api/product";
import { Product } from "@/app/(pages)/products/[id]/page";
import ProductPrimary from "@/components/products/product-primary";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { splitTitleInHalf } from "@/utils/splitArrayInHalf";
import Link from "next/link";
import React from "react";


const productsData: ProductType[] = [
  {
    id: 1,
    image: "/icons/products/1.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
  {
    id: 2,
    image: "/icons/products/2.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
  {
    id: 3,
    image: "/icons/products/3.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
  {
    id: 4,
    image: "/icons/products/4.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
  {
    id: 5,
    image: "/icons/products/5.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
  {
    id: 6,
    image: "/icons/products/6.png",
    name: "Laptop v23",
    description: "Laptop v23",
    default_price: 300,
    quantity: 1,
    status: "active",
    created_at: "2023-01-01",
    updated_at: "2023-01-01",
    price: 300,
    oldPrice: 559,
    rating: 4,
    category: "Electronics",
    sale: true,
  },
];

interface ProductSectionProps {
  title?: string;
  products?: Product[];
  linkAll: string;
  isCarousel?: boolean;
}

export default function ProductsSectionWithSidebar({
  title,
  products,
  linkAll,
  isCarousel = true,
}: ProductSectionProps) {
  const [firstTitle, secondTitle] = splitTitleInHalf(title || "");
  return (
    <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        {title && <div className="flex justify-between text-start border-b border-b-gray-200">
          <h2 className="text-base sm:text-lg md:text-2xl text-gray-400 border-b-2 border-primary flex gap-x-2 pb-2">
            <span>{firstTitle}</span>
            <span className="text-primary">{secondTitle}</span>
          </h2>
          <div className="inline-block pb-2 items-center text-xs md:text-base">
            <Link
              href={linkAll}
              className="flex items-center hover:text-primary text-gray-500"
            >
              <span>عرض الكل</span>
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                className="rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.25 7L14.75 12.5L9.25 18"
                  stroke="#F3B852"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>}
        {isCarousel ? (
          <Carousel className="mt-8">
            <CarouselContent>
              {products?.map((product, index) => (
                <CarouselItem
                  key={index + Math.random()}
                  className="basis-1/2 lg:basis-1/4"
                >
                  <ProductPrimary product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          products && <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-4">
            {[
              ...products
            ].map((item) => (
              <div key={item.id + Math.random()}>
                <ProductPrimary product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
