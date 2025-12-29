<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();                 // Código único del producto
            $table->string('name');                          // Nombre del producto
            $table->text('description')->nullable();         // Descripción opcional
            $table->foreignId('category_id')                 // Relación con categoría
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();
            $table->foreignId('supplier_id')                 // Relación con proveedor
                  ->nullable()
                  ->constrained('suppliers')
                  ->nullOnDelete();
            $table->decimal('cost_price', 10, 2)->default(0);   // Precio de costo (compra)
            $table->decimal('unit_price', 10, 2)->default(0);   // Precio de venta
            $table->integer('stock_quantity')->default(0);      // Cantidad en stock
            $table->integer('min_stock')->default(0);           // Stock mínimo (alertas)
            $table->boolean('is_active')->default(true);        // Activo/inactivo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
