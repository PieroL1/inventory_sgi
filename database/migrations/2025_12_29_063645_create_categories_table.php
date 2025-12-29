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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // Nombre de la categoría
            $table->text('description')->nullable();         // Descripción opcional
            $table->foreignId('parent_id')                   // Categoría padre (subcategorías)
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();
            $table->boolean('is_active')->default(true);     // Activa/inactiva
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
