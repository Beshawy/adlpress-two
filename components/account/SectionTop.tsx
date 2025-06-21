"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export default function SectionTop() {
    const pathname = usePathname()
  return pathname.endsWith("account/seller") && <div className="md:mt-20 px-4 bg-black w-full h-28 relative bg-[url('/icons/seller/bg.jpeg')]">
    <div className="bg-black/75 absolute inset-0 size-full flex flex-col justify-center items-center px-4 text-center">
      <p className="text-white/80">طور عملك، صل لملايين العملاء</p>
      <h2 className="text-white font-bold">ابدأ البيع اليوم!</h2>
    </div>
  </div>;
}
