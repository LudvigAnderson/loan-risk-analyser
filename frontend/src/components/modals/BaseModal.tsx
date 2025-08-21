import type { ReactNode } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import Button from "../core/Button";

interface BaseModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  buttonText: string;
  title: string;
  buttonClass?: string;
  children: ReactNode;
}

export default function BaseModal({ isOpen, setIsOpen, buttonText, title, buttonClass, children }: BaseModalProps) {
  return (
    <>
      <Button onClick={() => setIsOpen(true)} className={buttonClass}>{buttonText}</Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="w-[60vw] space-y-4 border bg-white p-12">
              <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
              {children}
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsOpen(false)}
                >Close</Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}