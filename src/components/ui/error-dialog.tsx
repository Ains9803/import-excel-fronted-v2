import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import FocusLock from "react-focus-lock"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
}

export function ErrorDialog({ open, onOpenChange, title = "Error", message }: ErrorDialogProps) {
  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md bg-white border-slate-200 shadow-lg">
        <FocusLock disabled={!open} returnFocus>
          <div className="absolute right-4 top-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              size="icon"
              className="text-slate-400 hover:text-slate-600 border-0 shadow-none"
              aria-label="Cerrar diálogo. Presiona Escape para cerrar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                {title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-slate-700 leading-relaxed pt-2">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-6 border-t border-slate-200">
            <AlertDialogAction 
              onClick={() => onOpenChange(false)}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </FocusLock>
      </AlertDialogContent>
    </AlertDialog>
  )
}
