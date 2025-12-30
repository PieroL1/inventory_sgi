<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tabla para registrar movimientos de inventario (entradas, salidas, ajustes).
     */
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['entry', 'exit', 'adjustment'])->comment('Tipo: entry=entrada, exit=salida, adjustment=ajuste');
            $table->integer('quantity')->comment('Cantidad del movimiento (positivo o negativo para ajustes)');
            $table->text('reason')->nullable()->comment('Razón o descripción del movimiento');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Índices para mejorar rendimiento en consultas frecuentes
            $table->index('product_id');
            $table->index('user_id');
            $table->index('type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
