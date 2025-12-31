import { Link } from '@inertiajs/react';
import { Package, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function GuestLayout({ children }) {
    const { theme, setTheme } = useTheme();

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Fondo dividido */}
            <div className="absolute inset-0 flex">
                {/* Lado izquierdo - Azul con ilustración */}
                <div className="hidden lg:block lg:w-[45%] xl:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                    {/* Patrón decorativo de fondo */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-32 right-10 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"></div>
                    </div>
                    
                    {/* Grid decorativo */}
                    <div className="absolute inset-0 opacity-5">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Ilustración integrada - Parte superior, pegada arriba */}
                    <div className="absolute top-0 left-0 right-0 h-[50%] overflow-hidden">
                        {/* Imagen con altura mínima para responsive */}
                        <div 
                            className="absolute inset-0"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                            }}
                        >
                            <img 
                                src="/images/SGI_logo_login.png" 
                                alt="Gestión de Inventario" 
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Logo y texto - Parte inferior con más contenido */}
                    <div className="absolute bottom-0 left-0 right-0 h-[50%] flex flex-col justify-center items-center px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-2xl border border-white/10">
                                    <Package className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">SGI</h1>
                            </div>
                            <h2 className="text-xl font-medium text-white/90 mb-3">
                                Sistema de Gestión de Inventario
                            </h2>
                            <p className="text-primary-200/80 max-w-sm mx-auto text-sm mb-6">
                                Control total de productos, proveedores y movimientos de stock en un solo lugar.
                            </p>
                            
                            {/* Features compactos */}
                            <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-white/80 text-xs">Productos</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-white/80 text-xs">Proveedores</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                    <span className="text-white/80 text-xs">Movimientos</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                                    <span className="text-white/80 text-xs">Reportes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado derecho - Fondo claro/oscuro */}
                <div className="w-full lg:w-[55%] xl:w-1/2 bg-gray-100 dark:bg-gray-900 transition-colors duration-300"></div>
            </div>

            {/* Card de Login flotante con glassmorphism - más hacia la derecha */}
            <div className="relative z-20 w-full max-w-lg mx-4 lg:mx-0 lg:absolute lg:right-[5%] xl:right-[8%]">
                {/* Toggle de tema - esquina superior derecha del card */}
                <div className="absolute -top-14 right-0">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg border border-white/50 dark:border-gray-700/50"
                        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Card glassmorphism */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-white/50 dark:border-gray-700/50 p-8 sm:p-10">
                    {/* Logo móvil */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SGI</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Gestión de Inventario</p>
                        </div>
                    </div>

                    {children}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} SGI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
