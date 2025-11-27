import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-green-200 bg-green-50 text-green-600 hover:bg-green-100",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
        destructive:
          "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
        outline: "text-foreground border-slate-300 hover:bg-slate-50",
        success:
          "border-green-200 bg-green-50 text-green-600 hover:bg-green-100",
        warning:
          "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
