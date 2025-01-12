import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface CustomAlertDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  formContent?: React.ReactNode;
  isLoading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  buttonType?: "submit" | "button";
}

export function CustomAlertDialog({
  isOpen,
  description,
  formContent,
  isLoading,
  title,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  buttonType = "button",
}: Readonly<CustomAlertDialogProps>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {mounted && description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {mounted && formContent && <div>{formContent}</div>}
        {!formContent && (
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                isLoading={isLoading}
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                {cancelText ?? "Cancel"}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type={buttonType}
                isLoading={isLoading}
                size="sm"
                onClick={onConfirm}
              >
                {confirmText ?? "Yes"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
