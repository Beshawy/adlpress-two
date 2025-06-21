"use client";
import ProductsSectionWithSidebar from "@/components/pages/home/productsSectionWithSidebar";
import useFetch from "@/hooks/use-fetch";
import { notFound, useParams } from "next/navigation";
import React from "react";
import LoadingPage from "../../products/[id]/loading";

export default function Page() {
  const { id } =  useParams();
  const {data, loading, error} = useFetch(`/child-lasts/${id}?populate[products][populate]=*`)
  const category = data?.data as any
  const products = category?.products as any
  if (loading) {
    return <LoadingPage />
  }
  if (error) {
    return notFound()
  }
  return category && (
    <div>
      <ProductsSectionWithSidebar 
      products={products}
      isCarousel={false} title={`Products of ${category?.name} category`} linkAll={`/products/today-deals`} />
    </div>
  );
}
