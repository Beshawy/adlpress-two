"use client";
import "./global.css";
import React from "react";
import dynamic from "next/dynamic";
import HeaderApp from "@/components/layouts/Header";
import FooterApp from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToastApp } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

const Providers = dynamic(() => import("@/components/Providers"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/logo.png" type="image/png" />
      </head>
      <body dir="rtl" className="font-cairo" suppressHydrationWarning>
        <Providers>
          <NextTopLoader color="var(--primary)" />
          <div className="relative z-[48484817878]">
            <Toaster />
            <ToastApp />
          </div>
          <HeaderApp />
          <div className="-mt-4 md:mt-4"></div>
          {children}
          <FooterApp />
        </Providers>
      </body>
    </html>
  );
}
