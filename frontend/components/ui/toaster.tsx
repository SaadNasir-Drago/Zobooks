"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="w-96 bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-3">
              <div className="flex items-start">
                <div className="flex-1">
                  {title && (
                    <ToastTitle className="text-2xl font-semibold mt-1">
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription className="text-lg mt-1">
                      {description}
                    </ToastDescription>
                  )}
                </div>
                <ToastClose className="">
                  <X className="" />
                </ToastClose>
              </div>
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport className="fixed inset-0 flex items-center justify-center pointer-events-none" />
    </ToastProvider>
  );
}
