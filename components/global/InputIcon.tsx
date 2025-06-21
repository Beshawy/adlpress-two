import React, { ReactNode } from "react";
import { Input } from "../ui/input";
import { HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InputWithIconProps = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
};

const InputWithIcon = ({
  className,
  startIcon,
  endIcon,
}: InputWithIconProps) => {
  return (
    <div className={cn("relative overflow-hidden rounded-lg md:w-full border-2 border-primary h-10", className)}>
      <span className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {startIcon || null}
      </span>
      <Input
        placeholder="Search..."
        type="text"
        className="py-3 md:py-7 absolute top-1/2 transform -translate-y-1/2  px-10 text-gray-800" // Adds padding to make room for the icon
      />
      <span className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {endIcon || null}
      </span>{" "}
    </div>
  );
};

export default InputWithIcon;
