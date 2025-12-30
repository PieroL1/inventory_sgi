import { useFlashMessages } from '@/hooks/useFlashMessages';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    FolderTree,
    Truck,
    Package,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
    Bell,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Layout principal de la aplicación.
 * Diseño moderno con sidebar y glassmorphism.
 */
export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    useFlashMessages();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Categorías', href: route('categories.index'), icon: FolderTree, current: route().current('categories.*') },
        { name: 'Proveedores', href: route('suppliers.index'), icon: Truck, current: route().current('suppliers.*') },
        { name: 'Productos', href: route('products.index'), icon: Package, current: route().current('products.*') },
    ];

    return (
        <div className="min-h-screen bg-gradient-main">
            {/* Elementos decorativos de fondo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-violet-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-tl from-amber-400/10 to-orange-400/10 rounded-full blur-3xl" />
            </div>

            {/* Sidebar móvil (overlay) */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            >
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-72 bg-sidebar">
                    <div className="flex h-full flex-col">
                        {/* Logo móvil */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-sidebar-foreground">SGI</span>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Navegación móvil */}
                        <nav className="flex-1 px-4 py-6 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        item.current
                                            ? 'bg-sidebar-accent text-sidebar-primary shadow-glow sidebar-item-active'
                                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                    }`}
                                >
                                    <item.icon className={`h-5 w-5 ${item.current ? 'text-sidebar-primary' : ''}`} />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Usuario en sidebar móvil con menú */}
                        <div className="p-4 border-t border-sidebar-border">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                                            <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                        onClick={() => window.location.href = route('profile.edit')}
                                        className="gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Mi Perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            const form = document.createElement('form');
                                            form.method = 'POST';
                                            form.action = route('logout');
                                            const csrf = document.createElement('input');
                                            csrf.type = 'hidden';
                                            csrf.name = '_token';
                                            csrf.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                            form.appendChild(csrf);
                                            document.body.appendChild(form);
                                            form.submit();
                                        }}
                                        className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
                <div className="flex h-full flex-col bg-sidebar">
                    {/* Logo */}
                    <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-sidebar-foreground">SGI</span>
                                <p className="text-xs text-sidebar-foreground/50">Gestión de Inventario</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-4 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-3">
                            Menú Principal
                        </p>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                                    item.current
                                        ? 'bg-sidebar-accent text-sidebar-primary sidebar-item-active'
                                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:scale-[0.98]'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 transition-colors ${
                                    item.current ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70'
                                }`} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Usuario en sidebar desktop con menú dropdown */}
                    <div className="p-4 border-t border-sidebar-border">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                                        <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="top" className="w-56">
                                <DropdownMenuItem
                                    onClick={() => window.location.href = route('profile.edit')}
                                    className="gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Mi Perfil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        const form = document.createElement('form');
                                        form.method = 'POST';
                                        form.action = route('logout');
                                        const csrf = document.createElement('input');
                                        csrf.type = 'hidden';
                                        csrf.name = '_token';
                                        csrf.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                        form.appendChild(csrf);
                                        document.body.appendChild(form);
                                        form.submit();
                                    }}
                                    className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:pl-72 relative">
                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
                    <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                        {/* Botón menú móvil */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Título de página - con flex-1 para empujar acciones a la derecha */}
                        <div className="flex-1">
                            {header && (
                                <div className="text-lg font-semibold text-gray-900">
                                    {header}
                                </div>
                            )}
                        </div>

                        {/* Acciones - siempre a la derecha */}
                        <div className="flex items-center gap-2">
                            {/* Notificaciones */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
                                    </div>
                                    <div className="py-6 px-4 text-center">
                                        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gray-100 mb-3">
                                            <Bell className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No tienes notificaciones nuevas</p>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Menú de usuario (top bar - desktop) */}
                            <div className="hidden sm:block">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium hidden md:block">{user.name}</span>
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <DropdownMenuItem
                                            onClick={() => window.location.href = route('profile.edit')}
                                            className="gap-2"
                                        >
                                            <User className="h-4 w-4" />
                                            Mi Perfil
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                const form = document.createElement('form');
                                                form.method = 'POST';
                                                form.action = route('logout');
                                                const csrf = document.createElement('input');
                                                csrf.type = 'hidden';
                                                csrf.name = '_token';
                                                csrf.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                                form.appendChild(csrf);
                                                document.body.appendChild(form);
                                                form.submit();
                                            }}
                                            className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Cerrar Sesión
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
