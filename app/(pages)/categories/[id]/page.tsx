"use client";

import useFetch from "@/hooks/use-fetch";
import { notFound, useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/child-lasts/${id}?populate[products][populate]=*`);
  const category = data?.data as any;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-500 mb-4">جاري التحميل...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return notFound();
  }

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between text-start border-b border-b-gray-200">
          <h2 className="text-lg sm:text-2xl md:text-3xl text-yellow-500 font-bold border-b-2 border-yellow-500 flex pb-2 gap-x-2">
            <span>المنتجات</span>
            <span className="text-gray-600">في هذا التصنيف</span>
          </h2>
        </div>
        
        <div className="mt-10 text-center">
          <div className="text-xl text-gray-500">سيتم عرض المنتجات هنا قريباً</div>
          <div className="text-sm text-gray-400 mt-2">تصنيف: {category?.name || 'غير محدد'}</div>
        </div>
      </div>
    </section>
  );
}
