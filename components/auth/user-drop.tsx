"use client"

import { useState } from "react"
import { LogOut, User, ShoppingBag, HelpCircle } from 'lucide-react'
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/api"
import { useUser } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type UserDropProps = {
  user: any
  isMobile?: boolean
}

export default function UserDrop({ user, isMobile = false }: UserDropProps) {
  const [open, setOpen] = useState(false)
  const { setIsLoggedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
    setIsLoggedIn(false); // تحديث حالة تسجيل الدخول في UserContext
      
      // إرسال حدث لتحديث حالة تسجيل الدخول في المكونات الأخرى
      window.dispatchEvent(new Event('authStateChanged'));
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "تم تسجيل خروجك من الحساب"
      });
      
      router.push("/");
    } catch (error: any) {
      console.error("خطأ في تسجيل الخروج:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive"
      });
    }
  }

  const userName = user?.name || "مستخدم"

  const classForMobile =
    "flex gap-x-2 w-full whitespace-nowrap items-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
  const classForDesktop =
    "flex gap-x-2 h-12 w-full whitespace-nowrap items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${isMobile ? classForMobile : classForDesktop} text-secondary hover:text-secondary`}
        >
          <div className="flex items-center gap-2 ms-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-white transition-colors duration-200 group">
              <User className="h-8 w-8 text-yellow-400 group-hover:text-yellow-400 transition-colors duration-200" />
            </div>
            <span className="text-yellow-400 font-medium">مرحباً، {userName}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 rounded-lg relative z-[93494]">
        <DropdownMenuItem asChild className="py-3 cursor-pointer">
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span>السلة</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-3 cursor-pointer">
          <Link href="/account" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>الملف الشخصي</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-3 cursor-pointer">
          <Link href="/account/overview" className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <span>الطلبات السابقة</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="py-3 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
