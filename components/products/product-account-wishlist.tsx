import React from "react";
import { Button } from "../ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { ProductType } from "@/@types/api/product";

export default function ProductAccountWishlist({
  product
}: {
  product: ProductType
}) {
  return (
    <article className="h-full relative flex flex-col overflow-hidden border">
      <div className="overflow-hidden h-auto">
        <Image width={200} height={200}
          className="h-full w-full object-contain transition-all duration-300 group-hover:scale-125"
          src={product.image}
          alt="Product"
        />
        <Button size={"icon"} className="absolute top-0 end-0 m-2 px-3 py-2 bg-white">
         <Heart size={16} className="fill-primary stroke-primary" />
        </Button>
      </div>
      <div className="my-4 mx-auto flex w-full px-3 flex-col items-start justify-between">
        <div className="flex justify-between w-full">
          <h3 className="text-xs text-gray-400 w-full">{product.category}</h3>
          {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`block h-3 w-3 align-middle ${
                    index < product.rating ? 'text-yellow-500' : 'text-gray-400'
                  } sm:h-5 sm:w-5`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
        </div>
        <div>
          <h3 className="line-clamp-1 w-full text-gray-600">{product.name}</h3>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <del className="text-xs text-gray-400"> {product.oldPrice} </del>
            <p className="ms-1 text-sm  md:text-base font-semibold text-primary">{product.price}</p>
          </div>
          <Button size={"sm"} className="4xl:h-9 4xl:px-4 4xl:py-2 rounded-full bg-transparent sm:bg-primary md:bg-transparent xl:bg-primary shadow-none">
            <ShoppingCart className="size-4" />
            <span className="hidden sm:block md:hidden 4xl:block">أضف إلى السلة</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
