import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LinkApp from "@/components/global/LinkApp";
import Image from "next/image";
import { X } from "lucide-react";

type AlertType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  msg: string;
  btnText?: string;
  btnText2?: string;
  action: () => void;
};

export default function AlertCart({
  isOpen,
  setIsOpen,
  text,
  msg,
  btnText,
  btnText2,
  action
}: AlertType) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader className="text-center flex flex-col items-center space-y-4">
           <AlertDialogTitle>{text}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {msg}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full gap-2 flex flex-row">
          <div
            onClick={() => setIsOpen(false)}
            className="w-full flex justify-center items-center"
          >
            <AlertDialogAction className="w-full text-white">{btnText}</AlertDialogAction>
          </div>
          <div
            onClick={() => action()}
            className="w-full flex justify-center items-center"
          >
            <AlertDialogAction  className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">{btnText2}</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
