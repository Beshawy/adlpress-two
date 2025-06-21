import SectionTop from "@/components/account/SectionTop";
import AccountSidebarLinks from "@/components/layouts/AccountSidebarLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { FaFilter } from "react-icons/fa";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative container mx-auto md:mt-12">
      <SectionTop />
      <SidebarProvider>
        {/* start sidebar */}
        <Sidebar className="md:sticky xl:w-72 flex flex-col items-center border-none bg-white z-auto">
          <div className="h-full bg-white">
            <div className="flex flex-col items-center bg-white px-4 py-20 md:py-4">
              <SidebarContent className="w-full lg:w-4/5 border bg-transparent rounded-lg">
                <SidebarHeader>
                  <h1 className="text-center text-lg md:text-xl text-primary font-bold">
                    Account
                  </h1>
                </SidebarHeader>
                <AccountSidebarLinks/>
                {/* <SidebarGroup /> */}
              </SidebarContent>
            </div>
          </div>
          <SidebarFooter />
        </Sidebar>
        {/* end sidebar */}
        <main className="w-full p-4 space-y-2">
          <div className="pb-0 flex justify-end md:hidden items-center">
            {/* <h4 className="text-gray-700">Filter</h4> */}
            <SidebarTrigger className="text-gray-500 border border-gray-200 p-2 cursor-pointer rounded">
              <Menu className="size-5" />
            </SidebarTrigger>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
