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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Mensajes flash para notificaciones
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            // Alertas globales (contador de stock bajo y productos afectados)
            'alerts' => fn () => $request->user() ? [
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
