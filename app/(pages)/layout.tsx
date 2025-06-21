import HeaderApp from "@/components/layouts/Header";
import FooterApp from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToastApp } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";


export async function generateMetadata() {
  return {
    title: "Adlpress",
    content:
      "A playground to explore new Next.js 13/14 app directory features such as nested layouts, instant loading states, streaming, and component level data fetching.",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader color="var(--primary)" />
      <div className="relative z-[48484817878]">
        <Toaster />
        <ToastApp />
      </div>
      <HeaderApp />
      <div className="-mt-4 md:mt-4"></div>
      {children}
      <FooterApp />
    </>
  );
}
