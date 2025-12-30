<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use Carbon\Carbon;
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

        // Movimientos de los últimos 7 días para el gráfico
        $movementsByDay = $this->getMovementsByDay(7);

        // Movimientos recientes
        $recentMovements = StockMovement::with(['product', 'user'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'lowStockProducts' => $lowStockProducts,
            'recentProducts' => $recentProducts,
            'topValueProducts' => $topValueProducts,
            'movementsByDay' => $movementsByDay,
            'recentMovements' => $recentMovements,
        ]);
    }

    /**
     * Obtiene los movimientos agrupados por día.
     */
    private function getMovementsByDay(int $days): array
    {
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        // Generar todos los días (incluyendo los que no tienen movimientos)
        $allDays = [];
        for ($i = 0; $i < $days; $i++) {
            $date = Carbon::now()->subDays($days - 1 - $i)->format('Y-m-d');
            $allDays[$date] = [
                'date' => $date,
                'label' => Carbon::parse($date)->format('d M'),
                'entries' => 0,
                'exits' => 0,
                'adjustments' => 0,
                'total' => 0,
            ];
        }

        // Obtener movimientos reales de la base de datos
        $movements = StockMovement::select(
                DB::raw("DATE(created_at) as date"),
                'type',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(quantity) as quantity')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw("DATE(created_at)"), 'type')
            ->get();

        // Combinar con los datos reales
        foreach ($movements as $movement) {
            $date = $movement->date;
            if (isset($allDays[$date])) {
                $allDays[$date][$movement->type === 'entry' ? 'entries' : ($movement->type === 'exit' ? 'exits' : 'adjustments')] = (int) $movement->count;
                $allDays[$date]['total'] += (int) $movement->count;
            }
        }

        return array_values($allDays);
    }
}
