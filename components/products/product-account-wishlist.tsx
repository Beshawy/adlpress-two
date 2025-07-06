"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import { ProductType } from "@/@types/api/product"

interface ProductAccountWishlistProps {
  product: ProductType
}

const ProductAccountWishlist: React.FC<ProductAccountWishlistProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.image as string}
          alt={product.name || ""}
          fill
          className="object-cover"
        />
        {product.sale && product.sale > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            خصم {product.sale}%
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
        >
          <Heart className="h-4 w-4 fill-current" />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-yellow-600">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="flex-1 mr-2">
            إضافة للسلة
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductAccountWishlist 