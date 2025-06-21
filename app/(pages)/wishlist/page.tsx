"use client";
import { ProductType } from "@/@types/api/product";
import AlertCart from "@/components/cart/AlertCart";
import ProductPrimary from "@/components/products/product-primary";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";


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


export default function Wishlist() {
  const [productInWishlist, setProductInWishlist] = useState(productsData);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  return (
    <div className="mt-24 container mx-auto px-4">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1"></div>
        <div className="col-span-1 flex items-center">
          <h1 className="text-nowrap md:text-xl font-bold text-center w-full">المفضلة</h1>
        </div>
        <div className="col-span-1 flex justify-end">
          <Button
            disabled={productInWishlist.length === 0}
            variant={"link"}
            className="text-red-600 underline text-xs md:text-base"
            onClick={() => setIsOpenAlert(true)}
          >
            Empty Wishlist
          </Button>
        </div>
      </div>

      <div>
        {productInWishlist.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-7 gap-4">
            {/* {[
              ...productInWishlist,
              ...productInWishlist.reverse(),
              ...productInWishlist.reverse(),
              ...productInWishlist.reverse(),
            ].map((item) => (
              <div key={item.id + Math.random()}>
                <ProductPrimary product={item} />
              </div>
            ))} */}
          </div>
        ) : (
          <section className="bg-white dark:bg-gray-900 ">
            <div className="container flex mt-40 min-h-[80vh] px-6 py-12 mx-auto">
              <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                <p className="p-3 text-sm font-medium text-primary rounded-full bg-blue-50 dark:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                  Wishlist Is Empty
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Your wishlist is empty please add some products
                </p>
                <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                  <Button variant={"ghost"} className="w-2/4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:rotate-180"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span>Go back</span>
                  </Button>
                  <Button>Take me home</Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <AlertCart
        isOpen={isOpenAlert}
        setIsOpen={setIsOpenAlert}
        text="Empty Wishlist"
        msg="Are you sure you want to delete everything in Wishlist ?"
        btnText="No, go back"
        btnText2="Yes, delete"
        action={() => {
          setProductInWishlist([]);
          setIsOpenAlert(false);
        }}
      />
    </div>
  );
}
