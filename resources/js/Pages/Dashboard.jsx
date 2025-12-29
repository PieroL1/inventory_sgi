import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

/**
 * Página principal del Sistema de Gestión de Inventario.
 * Se mostrará después del login exitoso.
 */
export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    SGI - Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* TODO: Agregar métricas y widgets del inventario */}
                            <h3 className="text-lg font-medium">
                                Bienvenido al Sistema de Gestión de Inventario
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Aquí podrás gestionar productos, proveedores, categorías y movimientos de stock.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
