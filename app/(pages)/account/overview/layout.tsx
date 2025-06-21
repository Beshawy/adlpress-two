import ProductAccountLinks from "@/components/global/ProductAccountLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FaFilter } from "react-icons/fa";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProductAccountLinks />
      {children}
    </>
  );
}
