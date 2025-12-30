import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 selection:bg-primary selection:text-primary-foreground border-gray-200 dark:border-gray-700 h-10 w-full min-w-0 rounded-xl border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 text-base text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800",
        "hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
