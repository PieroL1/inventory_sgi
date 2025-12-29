<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirige la raíz al dashboard (si autenticado) o al login
Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // CRUD Categorías
    Route::resource('categories', CategoryController::class)->except(['show']);

    // CRUD Proveedores
    Route::resource('suppliers', SupplierController::class)->except(['show']);

    // CRUD Productos
    Route::resource('products', ProductController::class)->except(['show']);
});

require __DIR__.'/auth.php';
