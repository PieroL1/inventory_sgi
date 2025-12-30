import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-gray-200 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:border-primary-400 dark:focus-visible:border-primary-500 focus-visible:ring-primary-500/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }
