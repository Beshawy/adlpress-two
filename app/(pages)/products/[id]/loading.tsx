"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* عنوان الصفحة */}
            <Skeleton className="h-8 w-64 mx-auto" />
            
            {/* محتوى الصفحة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* صورة المنتج */}
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              </div>
              
              {/* تفاصيل المنتج */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingPage 