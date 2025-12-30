import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    Package, 
    ArrowLeft, 
    Pencil, 
    Plus,
    ArrowDownCircle,
    ArrowUpCircle,
    RefreshCw,
    TrendingUp,
    DollarSign,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';

/**
 * Página de detalle de producto con historial de movimientos.
 */
export default function Show({ product, movements, stats, filters }) {
    const [type, setType] = useState(filters.type || '');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleTypeChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setType(newValue);
        router.get(route('products.show', product.id), 
            newValue ? { type: newValue } : {}, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const getMovementBadge = (movementType) => {
        const styles = {
            entry: { variant: 'success', icon: ArrowDownCircle, label: 'Entrada' },
            exit: { variant: 'destructive', icon: ArrowUpCircle, label: 'Salida' },
            adjustment: { variant: 'warning', icon: RefreshCw, label: 'Ajuste' },
        };
        const style = styles[movementType] || styles.adjustment;
        const Icon = style.icon;
        return (
            <Badge variant={style.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {style.label}
            </Badge>
        );
    };

    const isLowStock = product.stock_quantity < product.min_stock;

    return (
        <AuthenticatedLayout>
            <Head title={`Producto: ${product.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('products.index')}>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[300px] sm:max-w-none">
                                    {product.name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    SKU: {product.sku}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('stock-movements.create', { product: product.id })}>
                            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Registrar Movimiento</span>
                                <span className="sm:hidden">Movimiento</span>
                            </Button>
                        </Link>
                        <Link href={route('products.edit', product.id)}>
                            <Button variant="outline" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                <span className="hidden sm:inline">Editar</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Alerta de stock bajo */}
                {isLowStock && (
                    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-amber-950/50 dark:to-orange-950/50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Stock Bajo</h3>
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    El stock actual ({product.stock_quantity}) está por debajo del mínimo ({product.min_stock}).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Cards Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Stock Actual */}
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock Actual</p>
                                    <p className={`text-3xl font-bold ${isLowStock ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                                        {product.stock_quantity}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Mín: {product.min_stock}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isLowStock ? 'bg-amber-100 dark:bg-amber-900' : 'bg-violet-100 dark:bg-violet-900'}`}>
                                    <Package className={`h-6 w-6 ${isLowStock ? 'text-amber-600' : 'text-violet-600 dark:text-violet-400'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Valor Inventario */}
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Inventario</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(stats.inventory_value)}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Precio: {formatCurrency(product.unit_price)}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900">
                                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Costo Total */}
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Costo Total</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(stats.inventory_cost)}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Costo: {formatCurrency(product.cost_price)}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ganancia Potencial */}
                    <Card className="glass-card">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ganancia Potencial</p>
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(stats.potential_profit)}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Margen: {product.cost_price > 0 ? Math.round(((product.unit_price - product.cost_price) / product.cost_price) * 100) : 0}%
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900">
                                    <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detalles del Producto */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Info General */}
                    <Card className="glass-card lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</p>
                                <p className="text-gray-900 dark:text-white">
                                    {product.description || 'Sin descripción'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categoría</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {product.category?.name || 'Sin categoría'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Proveedor</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {product.supplier?.name || 'Sin proveedor'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</p>
                                <Badge variant={product.is_active ? 'success' : 'secondary'}>
                                    {product.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen de Movimientos */}
                    <Card className="glass-card lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Resumen de Movimientos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-900 dark:bg-emerald-950/50">
                                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <ArrowDownCircle className="h-5 w-5" />
                                        <span className="text-sm font-medium">Entradas</span>
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                        +{stats.total_entries}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-900 dark:bg-red-950/50">
                                    <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                                        <ArrowUpCircle className="h-5 w-5" />
                                        <span className="text-sm font-medium">Salidas</span>
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
                                        -{stats.total_exits}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900 dark:bg-amber-950/50">
                                    <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                                        <RefreshCw className="h-5 w-5" />
                                        <span className="text-sm font-medium">Ajustes</span>
                                    </div>
                                    <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-300">
                                        {stats.total_adjustments}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Historial de Movimientos */}
                <Card className="glass-card">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg">Historial de Movimientos</CardTitle>
                        <Select value={type || 'all'} onValueChange={handleTypeChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="entry">Entradas</SelectItem>
                                <SelectItem value="exit">Salidas</SelectItem>
                                <SelectItem value="adjustment">Ajustes</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {movements.data.length > 0 ? (
                            <>
                                <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead className="text-right">Cantidad</TableHead>
                                                <TableHead>Motivo</TableHead>
                                                <TableHead>Usuario</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {movements.data.map((movement) => (
                                                <TableRow key={movement.id}>
                                                    <TableCell className="whitespace-nowrap text-sm">
                                                        {formatDate(movement.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getMovementBadge(movement.type)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-semibold">
                                                        <span className={
                                                            movement.type === 'entry' 
                                                                ? 'text-emerald-600 dark:text-emerald-400' 
                                                                : movement.type === 'exit' 
                                                                    ? 'text-red-600 dark:text-red-400' 
                                                                    : 'text-amber-600 dark:text-amber-400'
                                                        }>
                                                            {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : '±'}
                                                            {movement.quantity}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate text-sm text-gray-600 dark:text-gray-400">
                                                        {movement.reason || '—'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                        {movement.user?.name || 'Sistema'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Paginación */}
                                {movements.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Mostrando {movements.from} - {movements.to} de {movements.total} movimientos
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {movements.prev_page_url && (
                                                <Link href={movements.prev_page_url} preserveScroll>
                                                    <Button variant="outline" size="icon">
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Página {movements.current_page} de {movements.last_page}
                                            </span>
                                            {movements.next_page_url && (
                                                <Link href={movements.next_page_url} preserveScroll>
                                                    <Button variant="outline" size="icon">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                    <RefreshCw className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                    Sin movimientos
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {type ? 'No hay movimientos de este tipo.' : 'Este producto aún no tiene movimientos registrados.'}
                                </p>
                                <Link href={route('stock-movements.create', { product: product.id })}>
                                    <Button className="mt-4 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600">
                                        <Plus className="h-4 w-4" />
                                        Registrar primer movimiento
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
