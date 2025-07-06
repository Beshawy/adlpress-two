"use client";

import { useState } from "react";
import { Dialog, DialogContent,DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SignupDialog } from "./SignupDialog";
import LoginDialog from "./LoginDialog";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

type AuthDialogProps = {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export function AuthDialogs({ trigger, defaultOpen = false, open=false, onClose }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || open);
  const [dialogType, setDialogType] = useState<"login" | "signup" | "forgot">("login");

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

  const switchToForgot = () => {
    setDialogType("forgot");
  };

  const handleClose = () => {
    setIsOpen(false);
    setDialogType("login"); // إعادة تعيين النوع دائماً عند الإغلاق
    if (onClose) onClose();
  };

  return (
    <Dialog open={open || isOpen} onOpenChange={open ? undefined : handleOpenChange}>
      <DialogTrigger asChild>{trigger || <Button>تسجيل الدخول</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 max-h-[90vh] z-[83889383] overflow-y-scroll no-scrollbar gap-0 border rounded-lg">
        <DialogTitle>
          <VisuallyHidden>نافذة الدخول أو التسجيل</VisuallyHidden>
        </DialogTitle>
        <button
          onClick={handleClose}
          aria-label="إغلاق"
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-6 w-6" />
        </button>
        {dialogType === "login" ? (
          <LoginDialog onSwitchToSignup={switchToSignup} onSwitchToForgot={switchToForgot} onClose={handleClose} />
        ) : dialogType === "signup" ? (
          <SignupDialog onSwitchToLogin={switchToLogin} />
        ) : (
          <ForgotPasswordDialog onSwitchToLogin={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  );
}
