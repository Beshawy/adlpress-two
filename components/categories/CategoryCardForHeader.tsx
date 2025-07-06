import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import { Image as ImageType } from "../layouts/category-header";

export interface categoryCardProps {
  documentId: string;
  image: ImageType;
  name: string;
  isHome?: boolean;
}

const CategoryCardForHeader: React.FC<categoryCardProps> = ({ documentId, image, name, isHome}) => {
  return (
    <Link href={`/categories/${documentId}/`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 p-3">
        {/* صورة التصنيف */}
        <div className="relative bg-gray-50 rounded-lg p-3 flex items-center justify-center mb-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              height={48}
              width={48}
              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
              src={image?.url}
              alt={image?.alternativeText}
            />
          </div>
          
          {/* أيقونة السهم الصغيرة */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* عنوان التصنيف */}
        <div className="text-center">
          <h3 className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCardForHeader;
