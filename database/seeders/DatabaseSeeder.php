<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Genera datos de prueba para desarrollo.
     */
    public function run(): void
    {
        // Primero crear roles y permisos
        $this->call(RolePermissionSeeder::class);

        // Usuario admin de prueba
        $admin = User::factory()->create([
            'name' => 'Admin SGI',
            'email' => 'admin@sgi.test',
        ]);
        $admin->assignRole('admin');

        // Usuario operador de prueba
        $operator = User::factory()->create([
            'name' => 'Operador SGI',
            'email' => 'operador@sgi.test',
        ]);
        $operator->assignRole('operator');

        // Usuario viewer de prueba
        $viewer = User::factory()->create([
            'name' => 'Viewer SGI',
            'email' => 'viewer@sgi.test',
        ]);
        $viewer->assignRole('viewer');

        // Crear categorías principales
        $categories = Category::factory(5)->create();

        // Crear algunas subcategorías
        Category::factory(3)->create([
            'parent_id' => $categories->random()->id,
        ]);

        // Crear proveedores
        $suppliers = Supplier::factory(10)->create();

        // Crear productos asociados a categorías y proveedores existentes
        Product::factory(30)->create([
            'category_id' => fn () => $categories->random()->id,
            'supplier_id' => fn () => $suppliers->random()->id,
        ]);

        // Crear algunos productos con stock bajo para probar alertas
        Product::factory(5)->lowStock()->create([
            'category_id' => fn () => $categories->random()->id,
            'supplier_id' => fn () => $suppliers->random()->id,
        ]);
    }
}
