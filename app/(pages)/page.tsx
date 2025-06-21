"use client"
import HeroSection from '@/components/pages/home/HeroSection'
import ProductSection from '@/components/pages/home/productsSection';
import CategoriesSection from '@/components/pages/home/categoriesSection';
import Image from 'next/image';
import AxiosApp from '@/lib/axios';
import useFetch from '@/hooks/use-fetch';

export default function Page() {
  const {data} = useFetch(`/home-page?populate[sections][populate][products][populate]=*`)
  const sections = data?.data?.sections
  const sectionsTop = data?.data?.sections.slice(0, 2)
  const sectionsBottom = data?.data?.sections.slice(2)
  
  return (
    <>
      <main>
        {/* <SubHeader/> */}
        <HeroSection />
        <div>
          <CategoriesSection title="تسوق من أفضل الفئات" linkAll={`/categories`} isHome />
        </div>
        <div>
          {sectionsTop?.map((section:any, index:any) => (
            <ProductSection
              key={index}
              products={section.products}
              title={section.title}
              linkAll={`/products/${section.title.toLowerCase().split(" ", "-").join("-")}`}
              isCarousel={true}
            />
          ))}
          <div className='grid grid-cols-3 gap-4 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
            <Image className='rounded-none cursor-pointer' src={"/icons/home/1.png"} alt='' width={1000} height={1000} />
            <Image className='rounded-none cursor-pointer' src={"/icons/home/2.png"} alt='' width={1000} height={1000} />
            <Image className='rounded-none cursor-pointer' src={"/icons/home/3.png"} alt='' width={1000} height={1000} />
          </div>
          {sectionsBottom ?.map((section:any, index:any) => (
            <ProductSection
              key={index}
              products={section.products}
              title={section.title}
              linkAll={`/products/${section.title.toLowerCase().split(" ", "-").join("-")}`}
              isCarousel={true}
            />
          ))}
        </div>
      </main>
      {/* <Footer/> */}
    </>
  )
}
