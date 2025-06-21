"use client"
import { Product } from "@/app/(pages)/products/[id]/page";
import ProductCard from "@/components/products/product";

import useFetch from "@/hooks/use-fetch";
import { notFound, useParams } from "next/navigation";
import React from "react";
import LoadingPage from "../../products/[id]/loading";

function collectProducts(data: any): any[] {
  const products: any[] = [];
  const seenDocumentIds = new Set<string>();

  // Check if data.data.child_ones exists and is an array
  if (data?.data?.child_ones && Array.isArray(data.data.child_ones)) {
    // Iterate through each child_one
    data.data.child_ones.forEach((childOne: any) => {
      // Check if child_lasts exists and is an array
      if (childOne?.child_lasts && Array.isArray(childOne.child_lasts)) {
        // Iterate through each child_last
        childOne.child_lasts.forEach((childLast: any) => {
          // Check if products exists and is an array
          if (childLast?.products && Array.isArray(childLast.products)) {
            childLast.products.forEach((product: any) => {
              // Only add product if it exists and its documentId hasn't been seen
              if (product && product.documentId && !seenDocumentIds.has(product.documentId)) {
                products.push(product);
                seenDocumentIds.add(product.documentId);
              }
            });
          }
        });
      }
    });
  }

  return products;
}

export default function Page() {
   const {id} = useParams()
  // const [firstTitle, secondTitle] = splitTitleInHalf(title);
  const {data, loading, error} = useFetch(`/category-sections/${id}?populate[child_ones][populate][child_lasts][populate][products][populate]=*`, id as any)
  
  const products:Product[] = collectProducts(data)

  if (loading) {
    return <LoadingPage />
    
  }
  if (error) {
    return notFound()
  }
  return (
    <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between text-start border-b border-b-gray-200">
          <h2 className="text-lg sm:text-2xl md:text-3xl text-primary font-bold border-b-2 border-primary flex pb-2 gap-x-2">
            <span>Products</span>
            {/* <span className="text-secondary">{secondTitle}</span> */}
          </h2>
          {/* <div className="inline-block pb-2 items-center text-xs md:text-base">
          <Link
              href={linkAll}
              className="flex items-center hover:text-primary text-gray-500"
            >
              <span>View All</span>
              <IconLeftAndRight className="size-6 text-primary"/>
            </Link>
          </div> */}
        </div>
        
        {products && <div className="mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products?.map((item:Product) => (
            <div key={item.id}> 
              <ProductCard product={item}/>
            </div>
            ))}
        </div>}
      </div>
    </section>
  );
}
