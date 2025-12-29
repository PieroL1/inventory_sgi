import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';

/**
 * Página de listado de productos.
 */
export default function Index({ products }) {
    const handleDelete = (product) => {
        if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
            router.delete(route('products.destroy', product.id));
        }
    };

    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Productos
                    </h2>
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

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5 text-primary-600" />
                                Listado de Productos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {products.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        No hay productos
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza agregando tu primer producto.
                                    </p>
                                    <Link href={route('products.create')} className="mt-4">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Agregar Producto
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
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
                                                        <TableCell className="font-mono text-sm">
                                                            {product.sku}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {product.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {product.category ? (
                                                                <Badge variant="outline">
                                                                    {product.category.name}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            {product.supplier?.name || <span className="text-gray-400">—</span>}
                                                        </TableCell>
                                                        <TableCell className="text-right text-gray-600">
                                                            {formatCurrency(product.cost_price)}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(product.unit_price)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {isLowStock && (
                                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                                )}
                                                                <Badge
                                                                    variant={isLowStock ? 'destructive' : 'secondary'}
                                                                    className={isLowStock ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                                                                >
                                                                    {product.stock_quantity}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant={product.is_active ? 'default' : 'destructive'}
                                                                className={product.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                            >
                                                                {product.is_active ? 'Activo' : 'Inactivo'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link
                                                                            href={route('products.edit', product.id)}
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                            Editar
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(product)}
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
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
                            {products.last_page > 1 && (
                                <div className="flex items-center justify-between border-t pt-4 mt-4">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {products.from} a {products.to} de {products.total} resultados
                                    </p>
                                    <div className="flex gap-2">
                                        {products.prev_page_url && (
                                            <Link href={products.prev_page_url}>
                                                <Button variant="outline" size="sm">
                                                    Anterior
                                                </Button>
                                            </Link>
                                        )}
                                        {products.next_page_url && (
                                            <Link href={products.next_page_url}>
                                                <Button variant="outline" size="sm">
                                                    Siguiente
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
