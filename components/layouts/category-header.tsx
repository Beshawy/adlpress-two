"use client"

import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react"
import LinkApp from "../global/LinkApp"
import { Button } from "../ui/button"
import IconLeftAndRight from "../global/IconLeftAndRight"
import img1 from '/public/icons/category/3.png'
import CategoryCardForHeader from "../categories/CategoryCardForHeader"
import { usePathname } from "next/navigation"
import useFetch from "@/hooks/use-fetch"

export interface Image {
  alternativeText: string
  url: string
}

interface CategoryType {
  documentId: string;
  name: string;
  image: Image;
}

export function CategoryHeader() {
  const pathname = usePathname();
  const [selectParent, setSelectParent] = React.useState<CategoryType[]>([]);
  const [selectId, setSelectId] = React.useState<string>();
    const isHome = pathname.split("/").length === 1 || pathname === "/";
    const {data: categoryParent} = useFetch(`category-sections?populate=*`)
    const {data: categoriesHeader} = useFetch(`/child-ones/${selectId}?populate[child_lasts][populate]=*`, selectId as any)
    // const {data} = useFetch(`/products?filters[child_lasts][child_one][category_section][documentId][$eq]=dat9vgriyft9y8awckiok0f8&populate[child_lasts][populate][child_one][populate]=*`)
    
    return (
      <NavigationMenu className={`z-50 relative hidden bg-primary text-secondary lg:block w-full min-w-full`} dir="ltr">
        <NavigationMenuList className="flex justify-start">
          <NavigationMenuItem className="text-secondary">
            {/* {JSON.stringify(data)} */}
            <NavigationMenuTrigger className={` ${'!text-secondary'}`}>جميع الفئات</NavigationMenuTrigger>
            <NavigationMenuContent className="flex gap-4 p-4 md:w-[95vw]">
              <div className="w-[300px]">
                {categoryParent?.data?.map((item:any, index:number) => <Button onClick={() => setSelectParent(item.child_ones)} onMouseEnter={() => setSelectParent(item.child_ones)} key={index} variant={'ghost'} className="w-full flex justify-between h-14 rounded-none">
                  <span className="">{item.name}</span>
                  <IconLeftAndRight className="!size-7 text-gray-400"/>
                </Button>)}
              </div>
              <div className="w-[300px]">
                {selectParent?.map((e, index) => <Button onClick={() => setSelectId(e.documentId)} onMouseEnter={() => setSelectId(e.documentId)} key={index} variant={'ghost'} className="w-full flex justify-between h-14 rounded-none">
                  <span>{e.name}</span>
                  {/* <IconLeftAndRight className="!size-7 text-gray-400"/> */}
                </Button>)}
              </div>
              <div className="flex flex-wrap gap-x-5">
                {categoriesHeader?.data?.child_lasts?.map((item: CategoryType, index:number) =>  
                    <CategoryCardForHeader key={index} documentId={item.documentId} image={item.image} name={item.name} isHome={isHome}/>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {categoryParent?.data && categoryParent?.data?.slice(0, 8)?.map((item: CategoryType) => <NavigationMenuItem key={item.documentId}>
            <LinkApp href={`/categories-parent/${item.documentId}`} >
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${'!text-secondary'}`}>
                {item.name}
              </NavigationMenuLink>
            </LinkApp>
          </NavigationMenuItem>)}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
  
  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  })
  ListItem.displayName = "ListItem"