import { Search, SlidersHorizontal } from "lucide-react";
import InputWithIcon from "../global/InputIcon";
import React from "react";

export default function SubHeaderInput({ isMobileSidebar = false }: { isMobileSidebar?: boolean }) {
    if (isMobileSidebar) {
      return (
        <div className="w-full flex mt-2">
          <InputWithIcon
            className="bg-white !h-10 w-full border-2 border-black"
            startIcon={<Search />}
            endIcon={<SlidersHorizontal />}
          />
        </div>
      );
    }
    return (
      <>
        {/* البحث للشاشات الكبيرة */}
        <div className="w-full max-w-xl hidden md:flex mb-12 xl:mb-0 xl:pr-16 xl:w-7/12 justify-center mx-auto">
          <InputWithIcon
            className="bg-white !h-9"
            startIcon={<Search />}
            endIcon={<SlidersHorizontal />}
          />
        </div>
      </>
    );
  }