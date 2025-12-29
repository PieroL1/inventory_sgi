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
import { Plus, MoreHorizontal, Pencil, Trash2, Truck, Mail, Phone } from 'lucide-react';

/**
 * Página de listado de proveedores.
 */
export default function Index({ suppliers }) {
    const handleDelete = (supplier) => {
        if (confirm(`¿Estás seguro de eliminar el proveedor "${supplier.name}"?`)) {
            router.delete(route('suppliers.destroy', supplier.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Proveedores
                    </h2>
                    <Link href={route('suppliers.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Proveedor
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Proveedores" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="h-5 w-5 text-primary-600" />
                                Listado de Proveedores
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {suppliers.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Truck className="h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        No hay proveedores
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza agregando tu primer proveedor.
                                    </p>
                                    <Link href={route('suppliers.create')} className="mt-4">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Agregar Proveedor
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Teléfono</TableHead>
                                            <TableHead className="text-center">Productos</TableHead>
                                            <TableHead className="text-center">Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {suppliers.data.map((supplier) => (
                                            <TableRow key={supplier.id}>
                                                <TableCell className="font-medium">
                                                    {supplier.name}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.contact_email ? (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <Mail className="h-3 w-3" />
                                                            <span className="text-sm">{supplier.contact_email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.phone ? (
                                                        <div className="flex items-center gap-1 text-gray-600">
                                                            <Phone className="h-3 w-3" />
                                                            <span className="text-sm">{supplier.phone}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {supplier.products_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={supplier.is_active ? 'default' : 'destructive'}
                                                        className={supplier.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                    >
                                                        {supplier.is_active ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Abrir menú</span>
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => router.visit(route('suppliers.edit', supplier.id))}
                                                            >
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => handleDelete(supplier)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            {/* Paginación */}
                            {suppliers.last_page > 1 && (
                                <div className="flex items-center justify-between border-t pt-4 mt-4">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {suppliers.from} a {suppliers.to} de {suppliers.total} resultados
                                    </p>
                                    <div className="flex gap-2">
                                        {suppliers.prev_page_url && (
                                            <Link href={suppliers.prev_page_url}>
                                                <Button variant="outline" size="sm">
                                                    Anterior
                                                </Button>
                                            </Link>
                                        )}
                                        {suppliers.next_page_url && (
                                            <Link href={suppliers.next_page_url}>
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
