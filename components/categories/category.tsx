import { CategoriesType } from "@/@types/api/categories";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface categoryCardProps {
  category: CategoriesType
  isHome?: boolean
}

const CategoryCard: React.FC<categoryCardProps> = ({category, isHome }) => {
  return (
    <Link href={`/categories/${category?.documentId}/`}>
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* صورة التصنيف */}
        <div className="relative bg-gray-50 p-6 flex items-center justify-center">
          <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
            <Image
              height={96}
              width={96}
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
              src={category?.image?.url}
              alt={category?.name?.ar}
            />
          </div>
          
          {/* أيقونة السهم */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* عنوان التصنيف */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200 text-center">
            {category?.name?.ar}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

