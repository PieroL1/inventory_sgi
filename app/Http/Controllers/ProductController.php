<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
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
    public function index(): Response
    {
        $products = Product::with(['category', 'supplier'])
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products,
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
