<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Estadísticas generales
        $stats = [
            'products' => [
                'total' => Product::count(),
                'active' => Product::where('is_active', true)->count(),
            ],
            'categories' => [
                'total' => Category::count(),
                'active' => Category::where('is_active', true)->count(),
            ],
            'suppliers' => [
                'total' => Supplier::count(),
                'active' => Supplier::where('is_active', true)->count(),
            ],
            'inventory' => [
                'total_value' => Product::where('is_active', true)->sum(DB::raw('stock_quantity * unit_price')),
                'total_cost' => Product::where('is_active', true)->sum(DB::raw('stock_quantity * cost_price')),
            ],
            'lowStock' => [
                'count' => Product::where('is_active', true)->whereColumn('stock_quantity', '<', 'min_stock')->count(),
            ],
            'lowStock' => [
                'count' => Product::where('is_active', true)->whereColumn('stock_quantity', '<', 'min_stock')->count(),
            ],
        ];

        // Productos con stock bajo
        $lowStockProducts = Product::with(['category', 'supplier'])
            ->where('is_active', true)
            ->whereColumn('stock_quantity', '<', 'min_stock')
            ->orderBy('stock_quantity')
            ->limit(5)
            ->get();

        // Productos recientes
        $recentProducts = Product::with(['category'])
            ->latest()
            ->limit(5)
            ->get();

        // Productos más valiosos (por valor de inventario)
        $topValueProducts = Product::where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->orderByRaw('stock_quantity * unit_price DESC')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'lowStockProducts' => $lowStockProducts,
            'recentProducts' => $recentProducts,
            'topValueProducts' => $topValueProducts,
        ]);
    }
}
