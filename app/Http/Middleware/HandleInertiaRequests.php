<?php

namespace App\Http\Middleware;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     * Incluye datos de autenticación, mensajes flash y alertas globales.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                // Roles y permisos del usuario para control de acceso en frontend
                'roles' => fn () => $user ? $user->getRoleNames() : [],
                'permissions' => fn () => $user ? $user->getAllPermissions()->pluck('name') : [],
                // Helpers para verificar permisos en React
                'can' => fn () => $user ? [
                    // Productos
                    'products.view' => $user->can('products.view'),
                    'products.create' => $user->can('products.create'),
                    'products.edit' => $user->can('products.edit'),
                    'products.delete' => $user->can('products.delete'),
                    'products.export' => $user->can('products.export'),
                    // Categorías
                    'categories.view' => $user->can('categories.view'),
                    'categories.create' => $user->can('categories.create'),
                    'categories.edit' => $user->can('categories.edit'),
                    'categories.delete' => $user->can('categories.delete'),
                    // Proveedores
                    'suppliers.view' => $user->can('suppliers.view'),
                    'suppliers.create' => $user->can('suppliers.create'),
                    'suppliers.edit' => $user->can('suppliers.edit'),
                    'suppliers.delete' => $user->can('suppliers.delete'),
                    // Movimientos
                    'movements.view' => $user->can('movements.view'),
                    'movements.create' => $user->can('movements.create'),
                    'movements.export' => $user->can('movements.export'),
                    // Usuarios
                    'users.view' => $user->can('users.view'),
                    'users.create' => $user->can('users.create'),
                    'users.edit' => $user->can('users.edit'),
                    'users.delete' => $user->can('users.delete'),
                    // Dashboard
                    'dashboard.view' => $user->can('dashboard.view'),
                    'reports.view' => $user->can('reports.view'),
                ] : [],
            ],
            // Mensajes flash para notificaciones
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            // Alertas globales (contador de stock bajo y productos afectados)
            'alerts' => fn () => $user ? [
                'lowStockCount' => Product::where('is_active', true)
                    ->whereColumn('stock_quantity', '<', 'min_stock')
                    ->count(),
                'lowStockProducts' => Product::where('is_active', true)
                    ->whereColumn('stock_quantity', '<', 'min_stock')
                    ->orderBy('stock_quantity')
                    ->limit(5)
                    ->get(['id', 'name', 'sku', 'stock_quantity', 'min_stock']),
            ] : null,
        ];
    }
}
