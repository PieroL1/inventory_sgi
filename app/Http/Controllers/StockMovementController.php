<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

/**
 * Controlador para gestión de Movimientos de Stock.
 */
class StockMovementController extends Controller
{
    public function __construct(
        private StockService $stockService
    ) {}

    /**
     * Muestra el listado de movimientos de stock.
     */
    public function index(Request $request): Response
    {
        $query = StockMovement::with(['product', 'user']);

        // Filtro por producto
        if ($productId = $request->input('product')) {
            $query->where('product_id', $productId);
        }

        // Filtro por tipo
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        // Filtro por fecha desde
        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        // Filtro por fecha hasta
        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $movements = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'products' => Product::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'sku']),
            'types' => StockMovement::getTypes(),
            'filters' => [
                'product' => $request->input('product', ''),
                'type' => $request->input('type', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
            ],
        ]);
    }

    /**
     * Muestra el formulario para crear un movimiento.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('StockMovements/Create', [
            'products' => Product::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'stock_quantity']),
            'types' => StockMovement::getTypes(),
            'preselectedProduct' => $request->input('product_id'),
        ]);
    }

    /**
     * Almacena un nuevo movimiento de stock.
     */
    public function store(StockMovementRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $product = Product::findOrFail($validated['product_id']);

        try {
            $movement = $this->stockService->registerMovement(
                product: $product,
                type: $validated['type'],
                quantity: (int) $validated['quantity'],
                reason: $validated['reason'],
                user: $request->user()
            );

            $flash = ['success' => 'Movimiento de stock registrado exitosamente.'];

            // Agregar warning si el producto quedó con stock bajo
            if ($movement->lowStockAlert) {
                $flash['warning'] = sprintf(
                    '⚠️ Alerta: El producto "%s" tiene stock bajo. Stock actual: %d unidades (mínimo: %d).',
                    $movement->productName,
                    $movement->newStock,
                    $movement->minStock
                );
            }

            return redirect()
                ->route('stock-movements.index')
                ->with($flash);

        } catch (InvalidArgumentException $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }
}
