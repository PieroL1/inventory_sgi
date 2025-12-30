import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 dark:bg-primary/20 text-primary-700 dark:text-primary-300 [a&]:hover:bg-primary/20",
        secondary:
          "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 [a&]:hover:bg-gray-100 dark:[a&]:hover:bg-gray-700",
        destructive:
          "border-transparent bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 [a&]:hover:bg-red-100 dark:[a&]:hover:bg-red-900",
        outline:
          "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 [a&]:hover:bg-gray-50 dark:[a&]:hover:bg-gray-700",
        success:
          "border-transparent bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 [a&]:hover:bg-emerald-100 dark:[a&]:hover:bg-emerald-900",
        warning:
          "border-transparent bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 [a&]:hover:bg-amber-100 dark:[a&]:hover:bg-amber-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
