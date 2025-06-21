"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LinkApp from "../global/LinkApp";
import { CategoryHeader } from "./category-header";
import SubHeaderInput from "./SubHeaderInput";
import dynamic from "next/dynamic";

const DynamicCartBox = dynamic(() => import("../cart/CartBox"), {
  ssr: false,
});
const DynamicLinksNavbar = dynamic(
  () => import("./LinksNavbar").then((mod) => mod.LinksNavbar),
  { ssr: false }
);

export default function HeaderApp() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname.split("/").length === 1 || pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative h-16">
      <DynamicCartBox />
      <header
        className={`px-4 md:px-6 fixed top-0 left-0 right-0 z-[4447] ${
          isScrolled
            ? "bg-primary text-secondary shadow"
            : isHome
            ? "bg-primary text-secondary"
            : "bg-primary text-secondary"
        }`}
      >
        <div className="flex justify-between w-full shrink-0 items-center ">
          <LinkApp
            href="/"
            className="mr-6 hidden lg:flex items-center gap-x-2"
          >
            <Image
              src={"/icons/logo.png"}
              width={35}
              height={70}
              className="py-4"
              alt={"logo"}
            />
            <h1 className="text-2xl font-bold">Adlpress</h1>
          </LinkApp>
          <SubHeaderInput />
          <nav className="ms-auto hidden lg:flex gap-4 w-auto">
            <DynamicLinksNavbar />
          </nav>
          <div className="md:hidden">
            <LinkApp href="/" className="flex items-center gap-x-2">
              <Image
                src={"/icons/logo.png"}
                width={35}
                height={70}
                className="py-4"
                alt={"logo"}
              />
              <h1 className="text-lg font-bold">Adlpress</h1>
            </LinkApp>
          </div>
          <SideBarForApp />
        </div>
        <div className={""}>
          <CategoryHeader />
        </div>
      </header>
    </div>
  );
}

function SideBarForApp() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">تبديل قائمة التنقل</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="z-[81781454718]">
        <LinkApp href="/" className="mr-6 flex items-center gap-x-2">
          <Image
            src={"/icons/logo.png"}
            width={35}
            height={70}
            className="py-4"
            alt={"logo"}
          />
          <h1 className="text-xl font-bold">Adlpress</h1>
        </LinkApp>
        <div className="grid gap-2 py-6">
          <DynamicLinksNavbar isMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}
