"use client";
import "./global.css";
import React from "react";
import dynamic from "next/dynamic";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
