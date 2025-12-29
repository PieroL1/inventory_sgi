<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para gestión de Proveedores.
 */
class SupplierController extends Controller
{
    /**
     * Muestra el listado de proveedores.
     */
    public function index(): Response
    {
        $suppliers = Supplier::withCount('products')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Muestra el formulario para crear un proveedor.
     */
    public function create(): Response
    {
        return Inertia::render('Suppliers/Create');
    }

    /**
     * Almacena un nuevo proveedor.
     */
    public function store(SupplierRequest $request): RedirectResponse
    {
        Supplier::create($request->validated());

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Proveedor creado exitosamente.');
    }

    /**
     * Muestra el formulario para editar un proveedor.
     */
    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    /**
     * Actualiza un proveedor existente.
     */
    public function update(SupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update($request->validated());

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Proveedor actualizado exitosamente.');
    }

    /**
     * Elimina un proveedor.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        if ($supplier->products()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: el proveedor tiene productos asociados.');
        }

        $supplier->delete();

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Proveedor eliminado exitosamente.');
    }
}
