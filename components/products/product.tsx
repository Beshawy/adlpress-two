import { Product } from '@/app/(pages)/products/[id]/page';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import AddToCart from './addToCart';


const ProductCard: React.FC<{ product: Product, isCarousel?:boolean}> = ({
  product,
  // sale,
  isCarousel=true
}) => {
  const { data: session, status } = useSession()
  const user:any = session?.user

  return (
    
      <article className="relative border overflow-hidden shadow rounded-md">
        <Link href={`/products/${product?.documentId}/`}>
          <div className={`${"aspect-square" } overflow-hidden items-center h-32
          md:h-52 w-full bg-gray-100`}>
            <Image
              height={500} width={500}
              className="group-hover:scale-125 w-full h-full object-contain transition-all duration-300"
              src={product?.image?.url}
              alt={product?.name}
            />
          </div>
        </Link>
        {product?.discount  && (
          <div className="absolute top-0 end-0 bg-primary rounded-se-md rounded-es-md">
            <p className="text-[10px]  p-1 font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1">
              خصم {product?.discount}%
            </p>
          </div>
        )}
        
        <div className=" flex items-start justify-between p-2 pt-5 relative">
          {status === "authenticated"  && (
           <AddToCart productDocumentId={product?.documentId}/>
          )}

          <div>
            <h4 className="text-xs sm:text-sm text-gray-500">
              {product?.child_lasts?.length > 0 && <Link href={`/categories/${product?.child_lasts[0].documentId}`} title={product?.child_lasts[0].name} className="cursor-pointer text-primary">
                {product?.child_lasts[0]?.name}
              </Link>}
            </h4>
            <h3 className="font-semibold text-xs sm:text-base md:text-lg text-gray-500">
              <span className="cursor-pointer">{product?.name}</span>
            </h3>
          </div>
          <Link href={`/products/${product?.documentId}/`}>
            <div className="text-end flex flex-col items-end">
              <div className="flex items-end">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`block h-3 w-3 align-middle ${
                      index < product?.reviews?.length ? 'text-yellow-500' : 'text-gray-400'
                    } sm:h-4 sm:w-4`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className='flex gap-x-2 items-center'>
                <p className="text-xs sm:text-sm md:text-base text-secondary font-bold">
                  {product?.discount ? product?.price - (product?.price * (product?.discount / 100)) : product?.price}
                </p>
                {product?.discount && (
                  <del className="mt-px text-xs sm:font-semibold text-gray-400 sm:text-sm">
                    {product?.price}
                  </del>
                )}
              </div>
            </div>
          </Link>
        </div>
      </article>
  );
};

export default ProductCard;