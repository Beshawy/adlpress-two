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
import { signOut } from "next-auth/react"

type UserDropProps = {
  user: any
  isMobile?: boolean
}

export default function UserDrop({ user, isMobile = false }: UserDropProps) {
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
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
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-black">
              <User className="h-5 w-5" />
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
        {/* <DropdownMenuItem asChild className="py-3 cursor-pointer">
          <Link href="/account/overview" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>الحساب</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="py-3 cursor-pointer">
          <Link href="/account/support" className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <span>الدعم</span>
          </Link>
        </DropdownMenuItem> */}
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
