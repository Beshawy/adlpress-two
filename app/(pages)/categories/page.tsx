import CategoriesSection from '@/components/pages/home/categoriesSection'
import ProductsSection from '@/components/pages/home/ProductsSection'
import React from 'react'

export default function Categories() {
  return (
    <>
      <CategoriesSection title="كل التصنيفات" linkAll="/categories" isHome={false} />
      <ProductsSection />
    </>
  );
}
