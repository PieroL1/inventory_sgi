<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador para gestión de Categorías.
 * Maneja CRUD completo con páginas Inertia.
 */
class CategoryController extends Controller
{
    /**
     * Muestra el listado de categorías.
     */
    public function index(): Response
    {
        $categories = Category::with('parent')
            ->withCount('products')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Muestra el formulario para crear una categoría.
     */
    public function create(): Response
    {
        // Solo categorías activas y sin padre (principales) para ser padres
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Categories/Create', [
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Almacena una nueva categoría.
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Muestra el formulario para editar una categoría.
     */
    public function edit(Category $category): Response
    {
        // Excluir la categoría actual y sus hijos de las opciones de padre
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Categories/Edit', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Actualiza una categoría existente.
     */
    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return redirect()
            ->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Elimina una categoría.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Verificar si tiene productos asociados
        if ($category->products()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: la categoría tiene productos asociados.');
        }

        // Verificar si tiene subcategorías
        if ($category->children()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: la categoría tiene subcategorías.');
        }

        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }
}
