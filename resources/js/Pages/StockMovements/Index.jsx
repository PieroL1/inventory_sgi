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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    ArrowLeftRight,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    Calendar,
} from 'lucide-react';

/**
 * Página de listado de movimientos de stock.
 */
export default function Index({ movements, products, types, filters }) {
    const [product, setProduct] = useState(filters.product || '');
    const [type, setType] = useState(filters.type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = (newFilters = {}) => {
        const params = {
            product: newFilters.product ?? product,
            type: newFilters.type ?? type,
            date_from: newFilters.date_from ?? dateFrom,
            date_to: newFilters.date_to ?? dateTo,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null) {
                delete params[key];
            }
        });

        router.get(route('stock-movements.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setProduct('');
        setType('');
        setDateFrom('');
        setDateTo('');
        router.get(route('stock-movements.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleProductChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setProduct(newValue);
        applyFilters({ product: newValue });
    };

    const handleTypeChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setType(newValue);
        applyFilters({ type: newValue });
    };

    const handleDateFromChange = (e) => {
        const newValue = e.target.value;
        setDateFrom(newValue);
        applyFilters({ date_from: newValue });
    };

    const handleDateToChange = (e) => {
        const newValue = e.target.value;
        setDateTo(newValue);
        applyFilters({ date_to: newValue });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTypeIcon = (movementType) => {
        switch (movementType) {
            case 'entry':
                return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />;
            case 'exit':
                return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
            case 'adjustment':
                return <RefreshCw className="h-4 w-4 text-amber-500" />;
            default:
                return null;
        }
    };

    const getTypeBadge = (movementType) => {
        const config = {
            entry: { label: 'Entrada', variant: 'success' },
            exit: { label: 'Salida', variant: 'destructive' },
            adjustment: { label: 'Ajuste', variant: 'warning' },
        };
        const { label, variant } = config[movementType] || { label: movementType, variant: 'secondary' };
        return <Badge variant={variant}>{label}</Badge>;
    };

    const hasFilters = filters.product || filters.type || filters.date_from || filters.date_to;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                            <ArrowLeftRight className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">Movimientos de Stock</h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{movements.total} registros</p>
                        </div>
                    </div>
                    <Link href={route('stock-movements.create')} className="shrink-0">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Nuevo Movimiento</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Movimientos de Stock" />

            <Card>
                <CardContent className="p-4 sm:p-6">
                    {/* Barra de filtros */}
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <Select value={product === '' ? 'all' : product} onValueChange={handleProductChange}>
                                <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-white/80">
                                    <SelectValue placeholder="Filtrar por producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los productos</SelectItem>
                                    {products.map((prod) => (
                                        <SelectItem key={prod.id} value={String(prod.id)}>
                                            {prod.sku} - {prod.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={type === '' ? 'all' : type} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 bg-white/80">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {Object.entries(types).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400 shrink-0 hidden sm:block" />
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={handleDateFromChange}
                                    className="flex-1 h-10 rounded-xl border-gray-200 bg-white/80"
                                    placeholder="Desde"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 hidden sm:block">-</span>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={handleDateToChange}
                                    className="flex-1 h-10 rounded-xl border-gray-200 bg-white/80"
                                    placeholder="Hasta"
                                />
                            </div>
                        </div>

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

                    {movements.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                                <ArrowLeftRight className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {hasFilters ? 'No se encontraron movimientos' : 'No hay movimientos'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                {hasFilters
                                    ? 'Intenta con otros filtros.'
                                    : 'Comienza registrando tu primer movimiento de stock.'}
                            </p>
                            {!hasFilters && (
                                <Link href={route('stock-movements.create')} className="mt-6">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Registrar Movimiento
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                                        <TableHead className="w-44">Fecha</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-center">Tipo</TableHead>
                                        <TableHead className="text-center">Cantidad</TableHead>
                                        <TableHead>Razón</TableHead>
                                        <TableHead>Usuario</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.data.map((movement) => (
                                        <TableRow key={movement.id}>
                                            <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                                                {formatDate(movement.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {movement.product?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                        {movement.product?.sku}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {getTypeIcon(movement.type)}
                                                    {getTypeBadge(movement.type)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-bold text-lg ${
                                                    movement.type === 'entry' ? 'text-emerald-600' :
                                                    movement.type === 'exit' ? 'text-red-600' :
                                                    movement.quantity > 0 ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                    {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : ''}
                                                    {movement.quantity > 0 && movement.type === 'adjustment' ? '+' : ''}
                                                    {movement.quantity}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                                {movement.reason || <span className="text-gray-400 dark:text-gray-500 italic">Sin razón</span>}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                                                {movement.user?.name}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Paginación */}
                    {movements.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Mostrando {movements.from} a {movements.to} de {movements.total} resultados
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!movements.prev_page_url}
                                    onClick={() => router.get(movements.prev_page_url)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {movements.links.slice(1, -1).map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'ghost'}
                                            size="sm"
                                            className="w-9 h-9"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!movements.next_page_url}
                                    onClick={() => router.get(movements.next_page_url)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
