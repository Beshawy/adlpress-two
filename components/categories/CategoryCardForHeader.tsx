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
    <Link href={`/categories/${documentId}/`} className="">
      <article className="relative ">
        <div className="flex items-start justify-between">
          <div className={`w-full flex flex-col justify-center items-center space-y-3`}>
            <div className={`rounded-full bg-gray-100 size-full flex justify-center items-center`}>
              <Image
                height={200}
                width={200}
                className="object-center object-contain py-2 size-20 rounded-full"
                src={image?.url}
                alt={image?.alternativeText}
              />
            </div>
            <div className="text-center">
              <h2 className="text-base text-gray-600 mb-2">{name}</h2>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCardForHeader;
