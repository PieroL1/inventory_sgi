"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

/**
 * DatePicker con soporte para dark mode y español.
 */
export function DatePicker({
    value,
    onChange,
    placeholder = "dd/mm/aaaa",
    className,
    disabled = false,
}) {
    const [open, setOpen] = React.useState(false)

    // Convertir string "YYYY-MM-DD" a Date
    const dateValue = React.useMemo(() => {
        if (!value) return undefined
        const [year, month, day] = value.split('-').map(Number)
        return new Date(year, month - 1, day)
    }, [value])

    // Convertir Date a string "YYYY-MM-DD"
    const handleSelect = (date) => {
        if (date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            onChange(`${year}-${month}-${day}`)
        } else {
            onChange('')
        }
        setOpen(false)
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onChange('')
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal h-10 rounded-xl",
                        "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700",
                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                        !value && "text-gray-400 dark:text-gray-500",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    {value ? (
                        <span className="flex-1 text-gray-900 dark:text-gray-100">
                            {format(dateValue, "dd/MM/yyyy", { locale: es })}
                        </span>
                    ) : (
                        <span className="flex-1">{placeholder}</span>
                    )}
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    locale={es}
                    initialFocus
                    className="rounded-xl border-0"
                />
            </PopoverContent>
        </Popover>
    )
}
