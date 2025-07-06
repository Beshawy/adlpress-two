"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus } from "lucide-react"
import { ProductType } from "@/@types/api/product"

interface ProductAccountCartProps {
  product: ProductType
}

const ProductAccountCart: React.FC<ProductAccountCartProps> = ({ product }) => {
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
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium">{product.quantity}</span>
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductAccountCart 