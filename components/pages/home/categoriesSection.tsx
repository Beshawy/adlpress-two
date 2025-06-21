"use client"
import { CategoriesType } from "@/@types/api/categories";
import CategoryCard from "@/components/categories/category";
import IconLeftAndRight from "@/components/global/IconLeftAndRight";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useFetch from "@/hooks/use-fetch";
import { splitArrayInHalf, splitTitleInHalf } from "@/utils/splitArrayInHalf";
import Link from "next/link";
import React from "react";
interface CategoriesSectionProps {
  title: string;
  linkAll: string;
  isHome?: boolean
}

export default function CategoriesSection({
  title,
  linkAll,
  isHome = false
}: CategoriesSectionProps) {

  const {data: categoriesData} =useFetch(`/child-lasts?populate=*`);


  const [firstHalf, secondHalf] = splitArrayInHalf(categoriesData?.data as any);
  const [firstTitle, secondTitle] = splitTitleInHalf(title);
  
  return (
    <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between text-start border-b border-b-gray-200">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-primary border-b-2 border-primary flex gap-x-2 pb-2">
            <span>{firstTitle}</span>
            <span className="text-secondary">
              {secondTitle}
            </span>
          </h2>
          <div className="flex items-center text-xs md:text-base">
            <Link
              href={linkAll}
              className="flex items-center hover:text-primary text-gray-500"
            >
              <span>عرض الكل</span>
             <IconLeftAndRight className="size-6 text-primary"/>
            </Link>
          </div>
        </div>
        {isHome ? <>
          <Carousel className="mt-8">
            <CarouselContent>
              {firstHalf.map((category: CategoriesType) => (
                <CarouselItem key={category.documentId} className="basis-1/7">
                  <CategoryCard category={category} isHome={isHome} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Carousel>
              <CarouselContent>
                {secondHalf.map((category: CategoriesType) => (
                  <CarouselItem key={category.documentId} className="basis-1/7">
                    <CategoryCard category={category} isHome={isHome}/>
                  </CarouselItem>
                ))}
              </CarouselContent>
          </Carousel>
        </> : <>
        <div className="mt-10 flex flex-wrap justify-center">
          {categoriesData?.data?.map((category: any) => (
            <div key={category.documentId} className="basis-1/6">
              <CategoryCard category={category}/>
            </div>
            ))}
        </div>
        </>}
      </div>
    </section>
  );
}

