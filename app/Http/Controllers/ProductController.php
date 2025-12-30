<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para gestión de Productos.
 */
class ProductController extends Controller
{
    /**
     * Muestra el listado de productos.
     */
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'supplier']);

        // Filtro de búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Filtro por categoría
        if ($categoryId = $request->input('category')) {
            $query->where('category_id', $categoryId);
        }

        // Filtro por proveedor
        if ($supplierId = $request->input('supplier')) {
            $query->where('supplier_id', $supplierId);
        }

        // Filtro por estado
        if ($request->has('status') && $request->input('status') !== '') {
            $query->where('is_active', $request->boolean('status'));
        }

        // Filtro por stock bajo
        if ($request->boolean('low_stock')) {
            $query->whereColumn('stock_quantity', '<', 'min_stock');
        }

        $products = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'supplier' => $request->input('supplier', ''),
                'status' => $request->input('status', ''),
                'low_stock' => $request->boolean('low_stock'),
            ],
        ]);
    }

    /**
     * Muestra el formulario para crear un producto.
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Almacena un nuevo producto.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Muestra el detalle de un producto con su historial de movimientos.
     */
    public function show(Request $request, Product $product): Response
    {
        $product->load(['category', 'supplier']);

        // Historial de movimientos con paginación
        $movementsQuery = $product->stockMovements()->with('user')->latest();

        // Filtro por tipo de movimiento
        if ($type = $request->input('type')) {
            $movementsQuery->where('type', $type);
        }

        $movements = $movementsQuery->paginate(10)->withQueryString();

        // Estadísticas del producto
        $stats = [
            'total_entries' => $product->stockMovements()->where('type', 'entry')->sum('quantity'),
            'total_exits' => $product->stockMovements()->where('type', 'exit')->sum('quantity'),
            'total_adjustments' => $product->stockMovements()->where('type', 'adjustment')->count(),
            'inventory_value' => $product->stock_quantity * $product->unit_price,
            'inventory_cost' => $product->stock_quantity * $product->cost_price,
            'potential_profit' => ($product->stock_quantity * $product->unit_price) - ($product->stock_quantity * $product->cost_price),
        ];

        return Inertia::render('Products/Show', [
            'product' => $product,
            'movements' => $movements,
            'stats' => $stats,
            'filters' => [
                'type' => $request->input('type', ''),
            ],
        ]);
    }

    /**
     * Muestra el formulario para editar un producto.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Actualiza un producto existente.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Elimina un producto.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }
}
