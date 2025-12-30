import { useFlashMessages } from '@/hooks/useFlashMessages';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    FolderTree,
    Truck,
    Package,
    ArrowLeftRight,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
    Bell,
    AlertTriangle,
    PanelLeftClose,
    PanelLeft,
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
 * Diseño moderno con sidebar colapsable y glassmorphism.
 */
export default function AuthenticatedLayout({ header, children }) {
    const { auth, alerts } = usePage().props;
    const user = auth.user;
    const lowStockCount = alerts?.lowStockCount || 0;
    const lowStockProducts = alerts?.lowStockProducts || [];
    useFlashMessages();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Estado del sidebar compacto (persistido en localStorage)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCollapsed') === 'true';
        }
        return false;
    });

    // Persistir estado del sidebar
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }, [sidebarCollapsed]);

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Categorías', href: route('categories.index'), icon: FolderTree, current: route().current('categories.*') },
        { name: 'Proveedores', href: route('suppliers.index'), icon: Truck, current: route().current('suppliers.*') },
        { name: 'Productos', href: route('products.index'), icon: Package, current: route().current('products.*'), badge: lowStockCount > 0 ? lowStockCount : null, badgeType: 'warning' },
        { name: 'Movimientos', href: route('stock-movements.index'), icon: ArrowLeftRight, current: route().current('stock-movements.*') },
    ];

    // Ancho del sidebar según estado
    const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-72';
    const contentMargin = sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72';

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
                className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
                <div className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] h-full bg-sidebar shadow-2xl transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Logo móvil */}
                        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-sidebar-border">
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
                        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        item.current
                                            ? 'bg-sidebar-accent text-sidebar-primary shadow-glow sidebar-item-active'
                                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                                    }`}
                                >
                                    <item.icon className={`h-5 w-5 shrink-0 ${item.current ? 'text-sidebar-primary' : ''}`} />
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Usuario en sidebar móvil */}
                        <div className="shrink-0 p-4 border-t border-sidebar-border">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                                            <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
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
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col transition-all duration-300 ${sidebarWidth}`}>
                <div className="flex h-full flex-col bg-sidebar">
                    {/* Logo */}
                    <div className={`flex h-16 shrink-0 items-center border-b border-sidebar-border ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-6'}`}>
                        <Link href="/" className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            {!sidebarCollapsed && (
                                <div>
                                    <span className="text-xl font-bold text-sidebar-foreground">SGI</span>
                                    <p className="text-xs text-sidebar-foreground/50">Gestión de Inventario</p>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
                        {!sidebarCollapsed && (
                            <p className="px-3 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-3">
                                Menú Principal
                            </p>
                        )}
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={sidebarCollapsed ? item.name : undefined}
                                className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                                    sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                                } ${
                                    item.current
                                        ? 'bg-sidebar-accent text-sidebar-primary sidebar-item-active'
                                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 active:scale-[0.98]'
                                }`}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 transition-colors ${
                                    item.current ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70'
                                }`} />
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="flex-1">{item.name}</span>
                                        {item.badge && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white shadow-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                                {sidebarCollapsed && item.badge && (
                                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Botón colapsar */}
                    <div className={`shrink-0 border-t border-sidebar-border ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={`flex items-center rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all ${
                                sidebarCollapsed ? 'w-full justify-center p-3' : 'w-full gap-3 px-4 py-2.5'
                            }`}
                            title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                        >
                            {sidebarCollapsed ? (
                                <PanelLeft className="h-5 w-5" />
                            ) : (
                                <>
                                    <PanelLeftClose className="h-5 w-5" />
                                    <span className="text-sm">Colapsar</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Usuario en sidebar desktop */}
                    <div className={`shrink-0 border-t border-sidebar-border ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`flex items-center rounded-xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors ${
                                    sidebarCollapsed ? 'w-full justify-center p-2' : 'w-full gap-3 px-3 py-3'
                                }`}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    {!sidebarCollapsed && (
                                        <>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                                                <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
                                            </div>
                                            <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
                                        </>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={sidebarCollapsed ? 'center' : 'end'} side="top" className="w-56">
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
            <div className={`${contentMargin} relative transition-all duration-300`}>
                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
                        {/* Botón menú móvil */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Título de página */}
                        <div className="flex-1 min-w-0">
                            {header && (
                                <div className="text-lg font-semibold text-gray-900 truncate">
                                    {header}
                                </div>
                            )}
                        </div>

                        {/* Acciones - siempre a la derecha */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            {/* Notificaciones */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative p-2 sm:p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Bell className="h-5 w-5" />
                                        {lowStockCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                                {lowStockCount > 9 ? '9+' : lowStockCount}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
                                        {lowStockCount > 0 && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-700">
                                                {lowStockCount}
                                            </span>
                                        )}
                                    </div>
                                    {lowStockProducts.length > 0 ? (
                                        <div className="py-2 max-h-80 overflow-y-auto">
                                            <div className="px-4 py-2">
                                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Bajo</p>
                                            </div>
                                            {lowStockProducts.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={route('stock-movements.create') + `?product_id=${product.id}`}
                                                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                                                            Stock: {product.stock_quantity} / Mín: {product.min_stock}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                            {lowStockCount > 5 && (
                                                <div className="px-4 py-2 border-t border-gray-100">
                                                    <Link
                                                        href={route('products.index') + '?low_stock=1'}
                                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                                    >
                                                        Ver todos los {lowStockCount} productos →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-6 px-4 text-center">
                                            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100 mb-3">
                                                <Package className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">¡Todo en orden!</p>
                                            <p className="text-xs text-gray-500 mt-1">No hay productos con stock bajo</p>
                                        </div>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Menú de usuario (top bar) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium hidden sm:block max-w-24 truncate">{user.name}</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
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
                </header>

                {/* Contenido de la página */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
