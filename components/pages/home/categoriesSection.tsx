"use client"
import { CategoriesType } from "@/@types/api/categories";
import IconLeftAndRight from "@/components/global/IconLeftAndRight";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { splitArrayInHalf, splitTitleInHalf } from "@/utils/splitArrayInHalf";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getAllCategories } from "@/lib/api";
import { buildCategoryTree, CategoryNode } from "@/utils/buildCategoryTree";
import { CategoryTree } from "@/components/categories/CategoryTree";
import CategoryCard from "@/components/categories/category";

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
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselApi = useRef<any>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allCategories = await getAllCategories();
      setCategories(allCategories || []);
      setCategoryTree(buildCategoryTree(allCategories || []));
    } catch (err: any) {
      setError(err.message || "فشل جلب التصنيفات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [firstHalf, secondHalf] = splitArrayInHalf(categories);
  const [firstTitle, secondTitle] = splitTitleInHalf(title);

  if (loading) return <div className="text-center py-10">جاري تحميل التصنيفات...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <section className="py-12 bg-white dark:bg-gray-800 dark:text-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-start border-b border-b-gray-200 pb-2">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-primary border-b-2 border-primary flex gap-x-2 pb-2">
            <span>{firstTitle}</span>
            <span className="text-secondary">
              {secondTitle}
            </span>
          </h2>
          {isHome && (
            <div className="flex items-center text-xs md:text-base">
              <Link href={linkAll} className="flex items-center hover:text-primary text-gray-500">
                <span>عرض الكل</span>
                <IconLeftAndRight className="size-6 text-primary" />
              </Link>
            </div>
          )}
        </div>
        {isHome ? (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {categories.slice(0, 10).map((category: any) => (
              <CategoryCard key={category._id || category.documentId} category={category} isHome={isHome} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {categories.map((category: any) => (
              <CategoryCard key={category._id || category.documentId} category={category} isHome={isHome} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

