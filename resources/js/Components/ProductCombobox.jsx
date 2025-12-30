import * as React from "react"
import { Check, ChevronDown, Package, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/**
 * Combobox para seleccionar productos con búsqueda por SKU o nombre.
 * Diseño simple con input y lista desplegable.
 */
export function ProductCombobox({
    products = [],
    value,
    onValueChange,
    placeholder = "Buscar producto por SKU o nombre...",
    error = false,
}) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef(null)
    const inputRef = React.useRef(null)

    const selectedProduct = React.useMemo(() => {
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
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (product) => {
        onValueChange(product.id.toString())
        setSearch("")
        setOpen(false)
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onValueChange("")
        setSearch("")
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
            {/* Input principal */}
            {selectedProduct && !open ? (
                // Mostrar producto seleccionado
                <button
                    type="button"
                    onClick={() => {
                        setOpen(true)
                        setTimeout(() => inputRef.current?.focus(), 0)
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-left transition-all hover:border-gray-300 dark:hover:border-gray-600",
                        error ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                    )}
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 shrink-0">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{selectedProduct.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{selectedProduct.sku}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                        Stock: {selectedProduct.stock_quantity}
                    </Badge>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </button>
            ) : (
                // Input de búsqueda
                <div className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all",
                    open ? "border-primary-500 ring-2 ring-primary-500/20" : "border-gray-200 dark:border-gray-700",
                    error && !open ? "border-red-500" : ""
                )}>
                    <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-none focus:ring-0"
                    />
                    {open && (
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                setSearch("")
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Lista desplegable */}
            {open && (
                <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-64 overflow-y-auto">
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
                                    onClick={() => handleSelect(product)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                        isSelected
                                            ? "bg-primary-50 dark:bg-primary-950 text-primary-900 dark:text-primary-100"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded shrink-0",
                                        isSelected ? "text-primary-600 dark:text-primary-400" : "text-transparent"
                                    )}>
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.sku}</p>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 tabular-nums">
                                        {product.stock_quantity}
                                    </Badge>
                                </button>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}
