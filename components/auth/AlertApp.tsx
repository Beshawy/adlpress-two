import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LinkApp from "@/components/global/LinkApp";
import Image from "next/image";
import { X } from "lucide-react";

type AlertAppType = {
  status?: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  msg: string;
  url?: string;
  btnText?: string;
};

export default function AlertApp({
  status=true,
  isOpen,
  setIsOpen,
  text,
  msg,
  url,
  btnText,
}: AlertAppType) {
  return (
    <AlertDialog open={isOpen} >
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader className="text-center flex flex-col items-center space-y-4">
          <div className="w-full flex justify-end items-start -mb-4">
            <X className="cursor-pointer" onClick={() => setIsOpen(false)}/>
          </div>
          <AlertDialogTitle>{text}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {msg}
          </AlertDialogDescription>
          {status ? <Image
            className="size-16 md:size-24"
            src="/icons/auth/toast.png"
            width={400}
            height={400}
            alt=""
          />: <svg className="size-16 md:size-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 8V12" stroke="#CF3F3C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 16.0195V16" stroke="#CF3F3C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <circle cx={12} cy={12} r={10} stroke="#CF3F3C" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>}
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full">
          {btnText && status &&
            (url ? (
              <LinkApp
                href={url}
               
                className="w-full flex justify-center items-center"
              >
                <AlertDialogAction className="w-2/4">
                  {btnText}
                </AlertDialogAction>
              </LinkApp>
            ) : (
              <div
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-center items-center"
              >
                <AlertDialogAction className="w-2/4">
                  {btnText}
                </AlertDialogAction>
              </div>
            ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
