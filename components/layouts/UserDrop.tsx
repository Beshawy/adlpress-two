"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';
import LinkApp from '../global/LinkApp';

export default function UserDrop({
    user,
}:{
    user: any,
}) {

  return (
    <div className="flex items-center gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-12 px-1 md:px-2 flex items-center md:gap-2 hover:bg-transparent hover:text-current border-none focus:border-none focus-visible:border-none" variant={"ghost"}>
          <ChevronDown />
          <span>{user?.username}</span>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="" />
            <AvatarFallback className='text-gray-700'>{user?.username[0] + user?.username[1]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LinkApp href="/account/settings" >
          <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
        </LinkApp>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  )
}
