import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, MoreHorizontal, Pencil, Trash2, Package, AlertTriangle, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Página de listado de productos.
 */
export default function Index({ products, categories, suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [supplier, setSupplier] = useState(filters.supplier || '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [lowStock, setLowStock] = useState(filters.low_stock || false);

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: newFilters.search ?? search,
            category: newFilters.category ?? category,
            supplier: newFilters.supplier ?? supplier,
            status: newFilters.status ?? status,
            low_stock: newFilters.low_stock ?? lowStock,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === false) {
                delete params[key];
            }
        });

        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            applyFilters({ search });
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setSupplier('');
        setStatus('');
        setLowStock(false);
        router.get(route('products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setCategory(newValue);
        applyFilters({ category: newValue });
    };

    const handleSupplierChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setSupplier(newValue);
        applyFilters({ supplier: newValue });
    };

    const handleStatusChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setStatus(newValue);
        applyFilters({ status: newValue });
    };

    const handleLowStockToggle = () => {
        const newValue = !lowStock;
        setLowStock(newValue);
        applyFilters({ low_stock: newValue });
    };

    const handleDelete = (product) => {
        if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
            router.delete(route('products.destroy', product.id));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const hasFilters = filters.search || filters.category || filters.supplier || filters.status !== '' || filters.low_stock;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Productos</h1>
                            <p className="text-sm text-gray-500">{products.total} registros</p>
                        </div>
                    </div>
                    <Link href={route('products.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Productos" />

            <Card>
                <CardContent className="p-6">
                    {/* Barra de búsqueda y filtros */}
                    <div className="space-y-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre, SKU o descripción..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="pl-11"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => applyFilters()}
                                className="gap-2"
                            >
                                <Search className="h-4 w-4" />
                                Buscar
                            </Button>
                            {hasFilters && (
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="gap-2 text-gray-500"
                                >
                                    <X className="h-4 w-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select value={category === '' ? 'all' : category} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200 bg-white/80">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={supplier === '' ? 'all' : supplier} onValueChange={handleSupplierChange}>
                                <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200 bg-white/80">
                                    <SelectValue placeholder="Proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los proveedores</SelectItem>
                                    {suppliers.map((sup) => (
                                        <SelectItem key={sup.id} value={String(sup.id)}>
                                            {sup.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={status === '' ? 'all' : status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 bg-white/80">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="1">Activos</SelectItem>
                                    <SelectItem value="0">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant={lowStock ? 'default' : 'outline'}
                                onClick={handleLowStockToggle}
                                className="gap-2"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                Stock bajo
                            </Button>
                        </div>
                    </div>

                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {hasFilters ? 'No se encontraron productos' : 'No hay productos'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 max-w-sm">
                                {hasFilters
                                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros.'
                                    : 'Comienza agregando tu primer producto para gestionar tu inventario.'}
                            </p>
                            {!hasFilters && (
                                <Link href={route('products.create')} className="mt-6">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Agregar Producto
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Proveedor</TableHead>
                                        <TableHead className="text-right">P. Costo</TableHead>
                                        <TableHead className="text-right">P. Venta</TableHead>
                                        <TableHead className="text-center">Stock</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.map((product) => {
                                        const isLowStock = product.stock_quantity < product.min_stock;

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-mono text-sm text-gray-600">
                                                    {product.sku}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {product.category ? (
                                                        <Badge variant="outline">
                                                            {product.category.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-600 text-sm">
                                                    {product.supplier?.name || <span className="text-gray-400">—</span>}
                                                </TableCell>
                                                <TableCell className="text-right text-gray-600 text-sm">
                                                    {formatCurrency(product.cost_price)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-gray-900">
                                                    {formatCurrency(product.unit_price)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {isLowStock && (
                                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                        )}
                                                        <Badge variant={isLowStock ? 'warning' : 'secondary'}>
                                                            {product.stock_quantity}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={product.is_active ? 'success' : 'destructive'}>
                                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Abrir menú</span>
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem
                                                                onClick={() => router.visit(route('products.edit', product.id))}
                                                                className="gap-2"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(product)}
                                                                className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Paginación */}
                    {products.total > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Mostrando <span className="font-medium text-gray-700">{products.from}</span> a <span className="font-medium text-gray-700">{products.to}</span> de <span className="font-medium text-gray-700">{products.total}</span> resultados
                            </p>
                            {products.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(products.prev_page_url)}
                                        disabled={!products.prev_page_url}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-1 px-2">
                                        {products.links.slice(1, -1).map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className="min-w-[36px]"
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(products.next_page_url)}
                                        disabled={!products.next_page_url}
                                        className="gap-1"
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
