import React from "react";
import InputWithIcon from "../global/InputIcon";
import {
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LanguageList from "./languages";

export default function HeaderApp() {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white">
      <div className="relative">
        <div className="fixed bottom-0 md:top-0 inset-x-0 h-12 md:text-white bg-white md:bg-transparent border-t md:border-t-0 border-t-gray-300  w-full  z-10 flex items-center px-4 justify-between">
          <div className="flex gap-x-2 items-center">
            <Image
              src={"/icons/logo.png"}
              width={35}
              height={70}
              className="py-4"
              alt={"logo"}
            />
            <h1 className="text-xl font-bold text-white">Adlpress</h1>
          </div>
          <div className="w-full md:w-auto">
            <ul className="flex gap-x-4 justify-between text-sm [&>*]:w-full md:[&>*]:w-auto  hover:[&>*]:bg-gray-200">
              <li>
                `<Link
                  href={"/auth/login"}
                  className="flex gap-x-2 justify-center items-center py-2"
                >
                  <UserCircle className="size-8 md:size-5" />
                  <span className="hidden md:block">تسجيل الدخول / اشتراك</span>
                </Link>`
              </li>
              <li>
                <Link
                  href={"/cart"}
                  className="flex gap-x-2 justify-center items-center py-2"
                >
                  <ShoppingCart className="size-8 md:size-5" />
                  <span className="hidden md:block">السلة</span>
                </Link>
              </li>
              <li>
                <Link
                  href={"/wishlist"}
                  className="flex gap-x-2 justify-center items-center py-2"
                >
                  <Heart className="size-8 md:size-5" />
                  <span className="hidden md:block">المفضلة</span>
                </Link>
              </li>
              <li>
                <LanguageList />
              </li>
            </ul>
          </div>
        </div>
        {/* <Image width={500} height={500} alt="header"
          src="https://s3-alpha-sig.figma.com/img/102f/ef8c/472baebe2ea40046f4f0859ab9232b04?Expires=1731888000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps172LaCvRVhoHxZb2seiJRxfxG~0fpNgPbankQy-JO~AKeIXE9rycR99M7dT8Lk4MCzW5foKZwA9LAfXuGf6eDlSzrSMnhsRDq2MS02vsauJmXdNohG~Tegj~nEn86ItkQUGxcHx-FGvH8mycPv0Mrl0smhesj11jhm6rTy6hJxR7o8nJQtQLMfn0QX9aQu-s6Z-csgLNCIhQcsLMIiKcdkjzntZxrm6XsTiRSCfH6oLaHdO87H6L3xacJWRKp~Agz6~FQfrrl6BemP0P2rm0eMV9NoUihTMEtC-54mLEcknpBb-cEHyKELSKOXG5ZPlXfJXGCyFcdRVcEyJN6t7g__"
          className="absolute inset-0 object-cover w-full h-full"
        /> */}
        {/* <div className="relative bg-opacity-75 dark:bg-opacity-[90%] bg-gray-950 pt-12">
          <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="text-white flex flex-col items-center justify-center">
              <div className="w-full flex justify-center items-center overflow-x-scroll scrollbar-hidden">
                <ul className="flex gap-x-4 my-4 text-sm w-full md:justify-center [&>*]:w-auto">
                  <li>All categories</li>
                  <li>New in</li>
                  <li>Sale</li>
                  <li>Electronics</li>
                  <li>Screens</li>
                  <li>Speakers</li>
                  <li>Covers</li>
                  <li>Cables</li>
                  <li>Chargers</li>
                  <li>Others</li>
                </ul>
              </div>
              <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12 flex justify-center">
                <InputWithIcon
                  className="bg-white"
                  startIcon={<Search />}
                  endIcon={<SlidersHorizontal />}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
