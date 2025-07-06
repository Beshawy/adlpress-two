"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"

interface Product {
  id: string | number
  title?: { ar: string; en: string }
  name?: string
  price?: number
  image?: string | Array<{ url: string }>
  description?: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getProductName = () => {
    if (product.title?.ar) return product.title.ar
    if (product.title?.en) return product.title.en
    if (product.name) return product.name
    return "منتج بدون اسم"
  }

  const getProductImage = () => {
    if (typeof product.image === 'string') return product.image
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0].url
    }
    return "/icons/products/1.png" // صورة افتراضية
  }

  const getProductPrice = () => {
    return product.price || 0
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <Image
          src={getProductImage()}
          alt={getProductName()}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          {getProductName()}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-yellow-600">
            ${getProductPrice().toFixed(2)}
          </span>
        </div>
        
        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
          <ShoppingCart className="h-4 w-4 mr-2" />
          إضافة للسلة
        </Button>
      </div>
    </div>
  )
}

export default ProductCard 