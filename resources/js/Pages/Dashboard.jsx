import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Package,
    FolderTree,
    Truck,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    DollarSign,
    BarChart3,
    Clock,
    ShoppingCart,
    ArrowDownCircle,
    ArrowUpCircle,
    RefreshCw,
    ArrowLeftRight,
    Calendar,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

/**
 * Tooltip personalizado para el gráfico con soporte dark mode.
 */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/**
 * Dashboard principal del Sistema de Gestión de Inventario.
 */
export default function Dashboard({ stats, lowStockProducts, recentProducts, topValueProducts, movementsByDay, recentMovements, chartDays = 7 }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const statCards = [
        {
            title: 'Productos',
            value: stats.products.total,
            subtitle: `${stats.products.active} activos`,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            href: route('products.index'),
        },
        {
            title: 'Categorías',
            value: stats.categories.total,
            subtitle: `${stats.categories.active} activas`,
            icon: FolderTree,
            color: 'from-violet-500 to-violet-600',
            bgColor: 'bg-violet-50',
            textColor: 'text-violet-600',
            href: route('categories.index'),
        },
        {
            title: 'Proveedores',
            value: stats.suppliers.total,
            subtitle: `${stats.suppliers.active} activos`,
            icon: Truck,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            href: route('suppliers.index'),
        },
        {
            title: 'Valor Inventario',
            value: formatCurrency(stats.inventory.total_value),
            subtitle: `Costo: ${formatCurrency(stats.inventory.total_cost)}`,
            icon: DollarSign,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
            href: route('products.index'),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Resumen del inventario</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Alerta de stock bajo prominente */}
                {stats.lowStock?.count > 0 && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-5 shadow-lg shadow-amber-500/25">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white">
                                        ¡Atención! {stats.lowStock.count} producto{stats.lowStock.count !== 1 ? 's' : ''} con stock bajo
                                    </h3>
                                    <p className="text-xs sm:text-sm text-white/80">
                                        Revisa el inventario y realiza los pedidos necesarios a tus proveedores.
                                    </p>
                                </div>
                            </div>
                            <Link href={route('products.index') + '?low_stock=1'} className="shrink-0">
                                <Button className="w-full sm:w-auto bg-white text-amber-600 hover:bg-white/90 gap-2 shadow-lg">
                                    Ver productos
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <Link key={index} href={stat.href}>
                            <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{stat.subtitle}</p>
                                        </div>
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Grid de contenido */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Productos con stock bajo */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    Stock Bajo
                                </CardTitle>
                                <Link href={route('products.index') + '?low_stock=1'}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                        Ver todos
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-3">
                                        <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No hay productos con stock bajo</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50/50 dark:from-amber-900/20 to-transparent border border-amber-100/50 dark:border-amber-800/30"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="warning" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {product.stock_quantity} / {product.min_stock}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Productos recientes */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Productos Recientes
                                </CardTitle>
                                <Link href={route('products.index')}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                        Ver todos
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {recentProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                        <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No hay productos registrados</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50/50 dark:from-blue-900/20 to-transparent border border-blue-100/50 dark:border-blue-800/30"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {product.category?.name || 'Sin categoría'}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">
                                                {product.stock_quantity} uds
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Gráfico de movimientos y movimientos recientes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico de movimientos */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                        <BarChart3 className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    Movimientos ({chartDays === 7 ? 'Últimos 7 días' : 'Último mes'})
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {/* Selector de período */}
                                    <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <button
                                            onClick={() => router.get(route('dashboard'), { chart_days: 7 }, { preserveState: true, preserveScroll: true })}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                                chartDays === 7 
                                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            7 días
                                        </button>
                                        <button
                                            onClick={() => router.get(route('dashboard'), { chart_days: 30 }, { preserveState: true, preserveScroll: true })}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                                chartDays === 30 
                                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                        >
                                            30 días
                                        </button>
                                    </div>
                                    <Link href={route('stock-movements.index')}>
                                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                            Ver todos
                                            <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {movementsByDay && movementsByDay.length > 0 ? (
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={movementsByDay} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                            <XAxis 
                                                dataKey="label" 
                                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                                className="text-gray-500 dark:text-gray-400"
                                                tickLine={false}
                                                axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                                className="text-gray-500 dark:text-gray-400"
                                                allowDecimals={false}
                                                tickLine={false}
                                                axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                                            />
                                            <Tooltip 
                                                content={<CustomTooltip />} 
                                                cursor={{ fill: 'rgba(107, 114, 128, 0.15)' }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ paddingTop: '10px' }}
                                                formatter={(value) => <span className="text-gray-700 dark:text-gray-300 text-sm">{value}</span>}
                                            />
                                            <Bar 
                                                dataKey="entries" 
                                                name="Entradas" 
                                                fill="#10b981" 
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar 
                                                dataKey="exits" 
                                                name="Salidas" 
                                                fill="#ef4444" 
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar 
                                                dataKey="adjustments" 
                                                name="Ajustes" 
                                                fill="#f59e0b" 
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                        <BarChart3 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No hay movimientos registrados</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Movimientos recientes */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                                        <ArrowLeftRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Últimos Movimientos
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {!recentMovements || recentMovements.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                        <RefreshCw className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sin movimientos</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentMovements.map((movement) => (
                                        <div
                                            key={movement.id}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 dark:from-gray-800/50 to-transparent border border-gray-100/50 dark:border-gray-700/30"
                                        >
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                movement.type === 'entry' 
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                                                    : movement.type === 'exit' 
                                                        ? 'bg-red-100 dark:bg-red-900/50' 
                                                        : 'bg-amber-100 dark:bg-amber-900/50'
                                            }`}>
                                                {movement.type === 'entry' && <ArrowDownCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                                                {movement.type === 'exit' && <ArrowUpCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                                                {movement.type === 'adjustment' && <RefreshCw className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {movement.product?.name || 'Producto'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {movement.type === 'entry' ? '+' : movement.type === 'exit' ? '-' : '±'}{movement.quantity} unidades
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Productos más valiosos */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                    <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                Mayor Valor en Inventario
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {topValueProducts.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                                    <ShoppingCart className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No hay productos en inventario</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                {topValueProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="relative p-4 rounded-xl bg-gradient-to-br from-gray-50 dark:from-gray-800 to-white dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all"
                                    >
                                        <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold shadow-md">
                                            {index + 1}
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">{product.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.stock_quantity} unidades</p>
                                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(product.stock_quantity * product.unit_price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href={route('products.create')}>
                        <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Nuevo Producto</p>
                                        <p className="text-sm text-blue-100">Agregar al inventario</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('categories.create')}>
                        <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                                        <FolderTree className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Nueva Categoría</p>
                                        <p className="text-sm text-violet-100">Organizar productos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('suppliers.create')}>
                        <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Nuevo Proveedor</p>
                                        <p className="text-sm text-emerald-100">Registrar contacto</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
