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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // Nombre del proveedor
            $table->string('contact_email')->nullable();     // Email de contacto
            $table->string('phone')->nullable();             // Teléfono
            $table->text('address')->nullable();             // Dirección
            $table->boolean('is_active')->default(true);     // Activo/inactivo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
