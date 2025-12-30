"use client"

import * as React from "react"
import { Check, ChevronDown, Package, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Combobox para filtrar por producto con búsqueda.
 * Incluye opción "Todos los productos".
 */
export function ProductFilterCombobox({
    products = [],
    value,
    onValueChange,
    placeholder = "Todos los productos",
}) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)
    const listRef = React.useRef(null)

    const selectedProduct = React.useMemo(() => {
        if (!value) return null
        return products.find((product) => product.id === parseInt(value))
    }, [products, value])

    // Filtrar productos basado en búsqueda
    const filteredProducts = React.useMemo(() => {
        if (!search.trim()) return products
        const searchLower = search.toLowerCase()
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchLower) ||
                product.sku.toLowerCase().includes(searchLower)
        )
    }, [products, search])

    // Cerrar al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false)
                setSearch("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (productId) => {
        onValueChange(productId)
        setSearch("")
        setOpen(false)
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onValueChange("")
        setSearch("")
        setOpen(false)
    }

    const handleInputFocus = () => {
        setOpen(true)
    }

    const handleInputChange = (e) => {
        setSearch(e.target.value)
        if (!open) setOpen(true)
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => {
                    setOpen(!open)
                    if (!open) {
                        setTimeout(() => inputRef.current?.focus(), 0)
                    }
                }}
                className={cn(
                    "w-full flex items-center gap-2 h-10 px-3 rounded-xl border text-left text-sm transition-all",
                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                    "border-gray-200 dark:border-gray-700",
                    "hover:border-gray-300 dark:hover:border-gray-600",
                    open && "border-primary-500 ring-2 ring-primary-500/20"
                )}
            >
                <Package className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                <span className={cn(
                    "flex-1 truncate",
                    selectedProduct 
                        ? "text-gray-900 dark:text-gray-100" 
                        : "text-gray-500 dark:text-gray-400"
                )}>
                    {selectedProduct ? `${selectedProduct.sku} - ${selectedProduct.name}` : placeholder}
                </span>
                {selectedProduct ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <ChevronDown className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        open && "rotate-180"
                    )} />
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                placeholder="Buscar por SKU o nombre..."
                                className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Options list */}
                    <div ref={listRef} className="max-h-60 overflow-y-auto overscroll-contain">
                        {/* Opción "Todos" */}
                        <button
                            type="button"
                            onClick={() => handleSelect("")}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                                !value
                                    ? "bg-primary-50 dark:bg-primary-950 text-primary-900 dark:text-primary-100"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            <div className={cn(
                                "flex h-4 w-4 items-center justify-center shrink-0",
                                !value ? "text-primary-600 dark:text-primary-400" : "text-transparent"
                            )}>
                                <Check className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                Todos los productos
                            </span>
                        </button>

                        {/* Separator */}
                        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />

                        {/* Product list */}
                        {filteredProducts.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                No se encontraron productos
                            </p>
                        ) : (
                            filteredProducts.map((product) => {
                                const isSelected = parseInt(value) === product.id
                                return (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => handleSelect(String(product.id))}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
                                            isSelected
                                                ? "bg-primary-50 dark:bg-primary-950 text-primary-900 dark:text-primary-100"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-4 w-4 items-center justify-center shrink-0",
                                            isSelected ? "text-primary-600 dark:text-primary-400" : "text-transparent"
                                        )}>
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                {product.sku}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
