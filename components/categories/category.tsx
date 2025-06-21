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
      <article className="relative ">
        <div className="flex items-start justify-between">
          <div className={`w-full ${isHome ? "p-4 md:p-8" : "p-4"} flex flex-col justify-center items-center`}>
            <div className="mb-8 rounded-xl p-4 size-16 md:size-28 bg-gray-100 flex justify-center items-center">
              <Image
                height={200}
                width={200}
                className="object-center object-contain size-24"
                src={category?.image?.url}
                alt={category?.name}
              />
            </div>
            <div className="text-center">
              <h2 className="text-base text-gray-600 mb-2">{category?.name}</h2>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
