import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Users, Plus, Search, MoreHorizontal, Pencil, Trash2, X, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFlashMessages } from '@/hooks/useFlashMessages';

/**
 * Página de listado de usuarios.
 * Solo accesible por administradores.
 */
export default function Index({ users, roles, filters }) {
    useFlashMessages();

    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

    // Debounce para búsqueda
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters({ search });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const applyFilters = (newFilters) => {
        router.get(route('users.index'), {
            ...filters,
            ...newFilters,
            page: 1,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleRoleChange = (value) => {
        const newValue = value === 'all' ? '' : value;
        setRole(newValue);
        applyFilters({ role: newValue });
    };

    const clearFilters = () => {
        setSearch('');
        setRole('');
        router.get(route('users.index'));
    };

    const confirmDelete = (user) => {
        setDeleteDialog({ open: true, user });
    };

    const handleDelete = () => {
        if (deleteDialog.user) {
            router.delete(route('users.destroy', deleteDialog.user.id));
        }
        setDeleteDialog({ open: false, user: null });
    };

    const getRoleBadgeColor = (roleName) => {
        switch (roleName) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'operator':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'viewer':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const getRoleLabel = (roleName) => {
        switch (roleName) {
            case 'admin': return 'Administrador';
            case 'operator': return 'Operador';
            case 'viewer': return 'Visor';
            default: return roleName;
        }
    };

    const hasActiveFilters = search || role;

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Usuarios
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {users.total} usuario{users.total !== 1 ? 's' : ''} registrado{users.total !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <Link href={route('users.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Nuevo Usuario</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Button>
                    </Link>
                </div>

                {/* Filtros */}
                <div className="glass-card rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Búsqueda */}
                        <div className="relative sm:col-span-2">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtro por rol */}
                        <Select value={role || 'all'} onValueChange={handleRoleChange}>
                            <SelectTrigger>
                                <Shield className="h-4 w-4 mr-2 text-gray-400" />
                                <SelectValue placeholder="Todos los roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={r.name}>
                                        {getRoleLabel(r.name)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Limpiar filtros */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Limpiar
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                <div className="glass-card rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="hidden md:table-cell">Creado</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No se encontraron usuarios
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getRoleBadgeColor(user.role_name)}>
                                                {getRoleLabel(user.role_name)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => router.visit(route('users.edit', user.id))}
                                                    >
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => confirmDelete(user)}
                                                        className="text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Paginación */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Mostrando {users.from} a {users.to} de {users.total}
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-primary-500 text-white'
                                                : link.url
                                                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará permanentemente al usuario{' '}
                            <strong>{deleteDialog.user?.name}</strong>. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
