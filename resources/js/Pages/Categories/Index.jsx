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
import { Plus, MoreHorizontal, Pencil, Trash2, FolderTree, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Página de listado de categorías.
 * Diseño moderno con glassmorphism y animaciones sutiles.
 */
export default function Index({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: newFilters.search ?? search,
            status: newFilters.status ?? status,
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null) {
                delete params[key];
            }
        });

        router.get(route('categories.index'), params, {
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
        setStatus('');
        router.get(route('categories.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value) => {
        const newStatus = value === 'all' ? '' : value;
        setStatus(newStatus);
        applyFilters({ status: newStatus });
    };

    const handleDelete = (category) => {
        if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
            router.delete(route('categories.destroy', category.id));
        }
    };

    const hasFilters = filters.search || filters.status !== '';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
                            <FolderTree className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Categorías</h1>
                            <p className="text-xs sm:text-sm text-gray-500">{categories.total} registros</p>
                        </div>
                    </div>
                    <Link href={route('categories.create')} className="shrink-0">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Nueva Categoría</span>
                            <span className="sm:hidden">Nueva</span>
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Categorías" />

            <Card>
                <CardContent className="p-6">
                    {/* Barra de búsqueda y filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o descripción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="pl-11"
                            />
                        </div>
                        <Select value={status === '' ? 'all' : status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl border-gray-200 bg-white/80">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="1">Activas</SelectItem>
                                <SelectItem value="0">Inactivas</SelectItem>
                            </SelectContent>
                        </Select>
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

                    {categories.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                                <FolderTree className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {hasFilters ? 'No se encontraron categorías' : 'No hay categorías'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 max-w-sm">
                                {hasFilters
                                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros.'
                                    : 'Comienza creando tu primera categoría para organizar tus productos.'}
                            </p>
                            {!hasFilters && (
                                <Link href={route('categories.create')} className="mt-6">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Categoría
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
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
                                            <TableCell className="font-medium text-gray-900">
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
                                                    <span className="text-gray-400 text-sm">Principal</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {category.products_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                                    {category.is_active ? 'Activa' : 'Inactiva'}
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
                                                            onClick={() => router.visit(route('categories.edit', category.id))}
                                                            className="gap-2"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(category)}
                                                            className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Paginación */}
                    {categories.total > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Mostrando <span className="font-medium text-gray-700">{categories.from}</span> a <span className="font-medium text-gray-700">{categories.to}</span> de <span className="font-medium text-gray-700">{categories.total}</span> resultados
                            </p>
                            {categories.last_page > 1 && (
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(categories.prev_page_url)}
                                        disabled={!categories.prev_page_url}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-1 px-2">
                                        {categories.links.slice(1, -1).map((link, index) => (
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
                                        onClick={() => router.get(categories.next_page_url)}
                                        disabled={!categories.next_page_url}
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
