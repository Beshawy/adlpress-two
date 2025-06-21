"use client";
// import FilterINsidebar from "@/components/categories/filterINsidebar";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { FaFilter } from "react-icons/fa";

import { useParams } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();

  return (
    <div className="relative">
      {/* <SidebarProvider className="hidden">
        <Sidebar className="md:sticky xl:w-72 !hidden ffflex flex-col items-center border-none">
          <div className="h-full flex flex-col items-center bg-white px-4 md:pt-16">
            <SidebarContent className="w-full lg:w-4/5 border ps-4 mt-5 bg-transparent">
              <SidebarHeader>
                <h1 className="text-center text-lg md:text-xl text-primary font-bold">
                  {id}
                </h1>
              </SidebarHeader>
              <SidebarGroup>
                <h4 className="font-bold">Filter</h4>
              </SidebarGroup>
              <SidebarGroup>
                <FilterINsidebar />
              </SidebarGroup>
            </SidebarContent>
          </div>
          <SidebarFooter />
        </Sidebar>
        <main className="w-full">
          <div className="p-4 pb-0 flex justify-between md:hidden items-center">
            <h4 className="text-gray-700">Filter</h4>
            <SidebarTrigger>
              <FaFilter className="size-7 text-primary" />
            </SidebarTrigger>
          </div>
          {children}
        </main>
      </SidebarProvider> */}
      <main className="w-full">
          {/* <div className="p-4 pb-0 flex justify-between md:hidden items-center">
            <h4 className="text-gray-700">Filter</h4>
            <SidebarTrigger>
              <FaFilter className="size-7 text-primary" />
            </SidebarTrigger>
          </div> */}
          {children}
        </main>
    </div>
  );
}
