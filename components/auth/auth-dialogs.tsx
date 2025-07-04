"use client";

import { useState } from "react";
import { Dialog, DialogContent,DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SignupDialog } from "./SignupDialog";
import LoginDialog from "./LoginDialog";

type AuthDialogProps = {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export function AuthDialogs({ trigger, defaultOpen = false, open=false, onClose }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || open);
  const [dialogType, setDialogType] = useState<"login" | "signup">("login");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) onClose();
  };

  const switchToLogin = () => {
    setDialogType("login");
  };

  const switchToSignup = () => {
    setDialogType("signup");
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open || isOpen} onOpenChange={open ? undefined : handleOpenChange}>
      <DialogTrigger asChild>{trigger || <Button>تسجيل الدخول</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 max-h-[90vh] z-[83889383] overflow-y-scroll no-scrollbar gap-0 border rounded-lg">
        <DialogTitle>
          <span style={{position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}>
            نافذة الدخول أو التسجيل
          </span>
        </DialogTitle>
        <button
          onClick={handleClose}
          aria-label="إغلاق"
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-6 w-6" />
        </button>
        {dialogType === "login" ? (
          <LoginDialog onSwitchToSignup={switchToSignup} onClose={handleClose} />
        ) : (
          <SignupDialog onSwitchToLogin={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  );
}
