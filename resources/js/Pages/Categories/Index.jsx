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
import { Plus, MoreHorizontal, Pencil, Trash2, FolderTree } from 'lucide-react';

/**
 * Página de listado de categorías.
 * Muestra una tabla con todas las categorías y acciones CRUD.
 */
export default function Index({ categories }) {
    // Función para eliminar una categoría
    const handleDelete = (category) => {
        if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
            router.delete(route('categories.destroy', category.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categorías
                    </h2>
                    <Link href={route('categories.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Categorías" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FolderTree className="h-5 w-5 text-primary-600" />
                                Listado de Categorías
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {categories.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FolderTree className="h-12 w-12 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        No hay categorías
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza creando tu primera categoría.
                                    </p>
                                    <Link href={route('categories.create')} className="mt-4">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear Categoría
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Categoría Padre</TableHead>
                                            <TableHead className="text-center">Productos</TableHead>
                                            <TableHead className="text-center">Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.data.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">
                                                    {category.name}
                                                </TableCell>
                                                <TableCell className="text-gray-500 max-w-xs truncate">
                                                    {category.description || '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {category.parent ? (
                                                        <Badge variant="outline">
                                                            {category.parent.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">Principal</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {category.products_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={category.is_active ? 'default' : 'destructive'}
                                                        className={category.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                    >
                                                        {category.is_active ? 'Activa' : 'Inactiva'}
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
                                                                onClick={() => router.visit(route('categories.edit', category.id))}
                                                            >
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => handleDelete(category)}
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
                            {categories.last_page > 1 && (
                                <div className="flex items-center justify-between border-t pt-4 mt-4">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {categories.from} a {categories.to} de {categories.total} resultados
                                    </p>
                                    <div className="flex gap-2">
                                        {categories.prev_page_url && (
                                            <Link href={categories.prev_page_url}>
                                                <Button variant="outline" size="sm">
                                                    Anterior
                                                </Button>
                                            </Link>
                                        )}
                                        {categories.next_page_url && (
                                            <Link href={categories.next_page_url}>
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
