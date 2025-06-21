"use client";
import { SessionProvider } from "next-auth/react";
import "./global.css";
import React from "react";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/icons/logo.png" type="image/png" />
      </head>
      <body
        dir="rtl"
        className="font-cairo"
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
