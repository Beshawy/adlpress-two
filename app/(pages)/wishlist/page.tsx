"use client";
import { ProductType } from "@/@types/api/product";
import AlertCart from "@/components/cart/AlertCart";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { getFavorites, deleteFavorite } from "@/lib/api";

export default function Wishlist() {
  const [productInWishlist, setProductInWishlist] = useState<any[]>([]);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    if (isLoggedIn) {
      getFavorites()
        .then((data) => {
          setProductInWishlist(Array.isArray(data) ? data : data.data || []);
          setLoading(false);
        })
        .catch(() => {
          setProductInWishlist([]);
          setLoading(false);
          setError("فشل جلب المفضلة");
        });
    } else {
      setProductInWishlist([]);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleDelete = async (id: string) => {
    await deleteFavorite(id);
    setProductInWishlist((prev) => prev.filter((item) => item._id !== id));
    setDeleteId(null);
    
    // إرسال حدث لتحديث العداد في الهيدر
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  return (
    <div className="mt-24 container mx-auto px-4">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="col-span-1"></div>
        <div className="col-span-1 flex items-center">
          <h1 className="text-nowrap md:text-xl font-bold text-center w-full">المفضلة</h1>
        </div>
        <div className="col-span-1 flex justify-end">
          <Button
            disabled={productInWishlist.length === 0}
            variant={"link"}
            className="text-red-600 underline text-xs md:text-base"
            onClick={() => setIsOpenAlert(true)}
          >
            Empty Wishlist
          </Button>
        </div>
      </div>

      <div>
        {productInWishlist.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-7 gap-4">
            {productInWishlist.map((item) => (
              <div key={item._id} className="relative">
                <img src={item.product?.image?.[0]?.url || "/icons/products/1.png"} alt={item.product?.title?.ar || "منتج"} className="w-full h-40 object-contain rounded" />
                <div className="mt-2 text-center font-bold">{item.product?.title?.ar || item.product?.title?.en || "اسم المنتج"}</div>
                <div className="text-center text-primary">{item.product?.price} د.ك</div>
                <button onClick={() => setDeleteId(item._id)} className="absolute top-2 left-2 bg-red-100 text-red-500 rounded-full p-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            ))}
          </div>
        ) : loading ? (
          <div className="text-center py-12">جاري تحميل المفضلة...</div>
        ) : (
          <section className="bg-white dark:bg-gray-900 ">
            <div className="container flex mt-40 min-h-[80vh] px-6 py-12 mx-auto">
              <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                <p className="p-3 text-sm font-medium text-primary rounded-full bg-blue-50 dark:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                  Wishlist Is Empty
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Your wishlist is empty please add some products
                </p>
                <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                  <Button variant={"ghost"} className="w-2/4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:rotate-180"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span>Go back</span>
                  </Button>
                  <Button>Take me home</Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {deleteId && (
        <AlertCart
          isOpen={!!deleteId}
          setIsOpen={() => setDeleteId(null)}
          msg={"هل أنت متأكد من حذف المنتج من المفضلة؟"}
          text="حذف المنتج"
          btnText="لا، تراجع"
          btnText2="نعم، احذف"
          action={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
}
