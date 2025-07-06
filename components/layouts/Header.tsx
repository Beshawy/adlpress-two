"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Heart } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LinkApp from "../global/LinkApp";
import { CategoryHeader } from "./category-header";
import SubHeaderInput from "./SubHeaderInput";
import dynamic from "next/dynamic";
import UserIcon from "../auth/UserIcon";
import CartIcon from "../cart/CartIcon";
import FavoriteBox from "../favorites/FavoriteBox";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/components/Providers";
import { getFavorites } from "@/lib/api";

const DynamicCartBox = dynamic(() => import("../cart/CartBox"), {
  ssr: false,
});
const DynamicLinksNavbar = dynamic(
  () => import("./LinksNavbar").then((mod) => mod.LinksNavbar),
  { ssr: false }
);
const DynamicUserIcon = dynamic(() => import("../auth/UserIcon"), {
  ssr: false,
});

export default function HeaderApp() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFavorite, setOpenFavorite] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const { isLoggedIn } = useUser();
  const pathname = usePathname();
  const isHome = pathname.split("/").length === 1 || pathname === "/";
  const { openCart, isCartOpen, cartItems } = useCart();

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

  // جلب المفضلة عند تسجيل الدخول
  useEffect(() => {
    if (isLoggedIn) {
      getFavorites()
        .then((data) => {
          setFavorites(Array.isArray(data) ? data : data.data || []);
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  // مراقبة تغييرات المفضلة من النوافذ الأخرى
  useEffect(() => {
    const handleFavoritesChange = () => {
      if (isLoggedIn) {
        getFavorites()
          .then((data) => {
            setFavorites(Array.isArray(data) ? data : data.data || []);
          })
          .catch(() => setFavorites([]));
      }
    };

    // إضافة مستمع للحدث المخصص
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, [isLoggedIn]);

  // مراقبة تغييرات السلة من النوافذ الأخرى
  useEffect(() => {
    const handleCartChange = () => {
      // تحديث السلة من السياق
      // لا نحتاج لفعل شيء هنا لأن cartItems يتم تحديثه تلقائياً من السياق
    };

    // إضافة مستمع للحدث المخصص
    window.addEventListener('cartUpdated', handleCartChange);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartChange);
    };
  }, []);

  // useEffect مستقل لمراقبة فتح البوكسات
  useEffect(() => {
    if (openFavorite || isCartOpen) {
      setOpen(false);
    }
  }, [openFavorite, isCartOpen]);

  // حساب عدد العناصر في السلة
  const cartItemsCount = cartItems.length;
  const favoritesCount = favorites.length;

  return (
    <div className="relative h-16">
      <DynamicCartBox />
      <FavoriteBox open={openFavorite} onOpenChange={setOpenFavorite} />
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
          <SideBarForApp open={open} setOpen={setOpen} openFavorite={openFavorite} setOpenFavorite={setOpenFavorite} />
          {isLoggedIn && (
            <div className="flex items-center gap-x-4 hidden md:flex border-2 border-white rounded-xl transition-colors duration-200 hover:border-yellow-400 p-1 ml-0 mr-12">
              <button
                onClick={() => setOpenFavorite(true)}
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-primary/80 hover:bg-yellow-400 transition-colors focus:outline-none shadow"
                title="المفضلة"
              >
                <Heart className="h-7 w-7 text-white group-hover:text-yellow-400 transition-colors duration-200" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-primary/80 hover:bg-secondary transition-colors focus:outline-none shadow"
                title="السلة"
              >
                <CartIcon color="white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/80 hover:bg-secondary transition-colors focus:outline-none shadow"
                title="الحساب"
                tabIndex={0}
                style={{ padding: 0 }}
              >
                <UserIcon color="white" />
              </button>
            </div>
          )}
        </div>
        {/* محرك البحث للشاشات الصغيرة فقط */}
        <div className="flex md:hidden w-full px-2 mt-2">
          <SubHeaderInput />
        </div>
        <div className={""}>
          <CategoryHeader />
        </div>
      </header>
    </div>
  );
}

function SideBarForApp(props: { open: boolean; setOpen: (open: boolean) => void; openFavorite: boolean; setOpenFavorite: (open: boolean) => void }) {
  const { isLoggedIn } = useUser();
  const { openCart, cartItems } = useCart();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      getFavorites()
        .then((data) => {
          setFavorites(Array.isArray(data) ? data : data.data || []);
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  // مراقبة تغييرات المفضلة من النوافذ الأخرى
  useEffect(() => {
    const handleFavoritesChange = () => {
      if (isLoggedIn) {
        getFavorites()
          .then((data) => {
            setFavorites(Array.isArray(data) ? data : data.data || []);
          })
          .catch(() => setFavorites([]));
      }
    };

    // إضافة مستمع للحدث المخصص
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, [isLoggedIn]);

  const cartItemsCount = cartItems.length;
  const favoritesCount = favorites.length;

  return (
    <Sheet open={props.open} onOpenChange={props.setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">تبديل قائمة التنقل</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="z-[81781454718] flex flex-col justify-between">
        <div>
          <LinkApp href="/" className="mr-6 flex items-center gap-x-2 mb-6">
            <Image
              src={"/icons/logo.png"}
              width={35}
              height={70}
              className="py-4"
              alt={"logo"}
            />
            <h1 className="text-xl font-bold">Adlpress</h1>
          </LinkApp>
          {/* محرك البحث أسفل اللوجو مباشرة */}
          <div className="w-full flex justify-center items-center px-2 mb-4">
            <div className="w-full max-w-xs">
              <SubHeaderInput isMobileSidebar />
            </div>
          </div>
          {isLoggedIn && (
            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={() => { props.setOpen(false); props.setOpenFavorite(true); }}
                className="relative flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-primary/80 hover:bg-yellow-400 transition-colors focus:outline-none shadow"
                title="المفضلة"
              >
                <Heart className="h-6 w-6 text-white" />
                <span className="text-base text-white">المفضلة</span>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { props.setOpen(false); openCart(); }}
                className="relative flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-primary/80 hover:bg-secondary transition-colors focus:outline-none shadow"
                title="السلة"
              >
                <CartIcon color="white" />
                <span className="text-base text-white">السلة</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { props.setOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-primary/80 hover:bg-secondary transition-colors focus:outline-none shadow"
                title="الحساب"
              >
                <UserIcon color="white" />
                <span className="text-base text-white">الحساب</span>
              </button>
            </div>
          )}
        </div>
        <div className="mb-4 flex justify-center">
          <DynamicLinksNavbar isMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
}
