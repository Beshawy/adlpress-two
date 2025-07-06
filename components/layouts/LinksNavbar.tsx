"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle, Heart } from "lucide-react";
import { AuthDialogs } from "../auth/auth-dialogs";
import CartIcon from "../cart/CartIcon";
import Link from "next/link";
import { isTokenValid } from "@/lib/api";
import { useUser } from "@/components/Providers";

export function LinksNavbar({ isMobile = false }: { isMobile?: boolean }) {
  const { isLoggedIn } = useUser();

  const classForMobile =
    "flex gap-x-2 w-full whitespace-nowrap items-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50";
  const classForDesktop =
    "flex gap-x-2 h-12 w-full whitespace-nowrap items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50";

  return (
    <>
      {/* تم حذف أيقونة السلة المكررة هنا */}
      {!isLoggedIn && (
        <AuthDialogs
          trigger={
            <Button
              className={`bg-secondary text-black hover:bg-primary hover:text-secondary ${
                isMobile ? 'w-full flex justify-center ' + classForMobile : classForDesktop
              } ${isMobile ? '' : 'mr-8'}`}
            >
              <UserCircle className="size-8 md:size-5" />
              <span className="w-auto">تسجيل الدخول / إنشاء حساب</span>
            </Button>
          }
        />
      )}
    </>
  );
} 