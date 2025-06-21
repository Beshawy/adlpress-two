import { Search, SlidersHorizontal } from "lucide-react";
import InputWithIcon from "../global/InputIcon";

export default function SubHeaderInput() {
    return (
      <>
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