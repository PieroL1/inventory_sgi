<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * Seeder para crear roles y permisos del sistema SGI.
 * 
 * Roles:
 * - admin: Acceso total al sistema
 * - operator: Gestión de inventario (productos, movimientos, proveedores, categorías)
 * - viewer: Solo lectura y exportación
 */
class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Resetear cache de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // =========================================
        // PERMISOS
        // =========================================
        
        // Permisos de productos
        Permission::create(['name' => 'products.view']);
        Permission::create(['name' => 'products.create']);
        Permission::create(['name' => 'products.edit']);
        Permission::create(['name' => 'products.delete']);
        Permission::create(['name' => 'products.export']);

        // Permisos de categorías
        Permission::create(['name' => 'categories.view']);
        Permission::create(['name' => 'categories.create']);
        Permission::create(['name' => 'categories.edit']);
        Permission::create(['name' => 'categories.delete']);

        // Permisos de proveedores
        Permission::create(['name' => 'suppliers.view']);
        Permission::create(['name' => 'suppliers.create']);
        Permission::create(['name' => 'suppliers.edit']);
        Permission::create(['name' => 'suppliers.delete']);

        // Permisos de movimientos de stock
        Permission::create(['name' => 'movements.view']);
        Permission::create(['name' => 'movements.create']);
        Permission::create(['name' => 'movements.export']);

        // Permisos de usuarios (solo admin)
        Permission::create(['name' => 'users.view']);
        Permission::create(['name' => 'users.create']);
        Permission::create(['name' => 'users.edit']);
        Permission::create(['name' => 'users.delete']);

        // Permisos de dashboard y reportes
        Permission::create(['name' => 'dashboard.view']);
        Permission::create(['name' => 'reports.view']);

        // =========================================
        // ROLES
        // =========================================

        // Admin: Acceso total
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Operator: Gestión de inventario
        $operatorRole = Role::create(['name' => 'operator']);
        $operatorRole->givePermissionTo([
            'dashboard.view',
            'products.view',
            'products.create',
            'products.edit',
            'products.export',
            'categories.view',
            'categories.create',
            'categories.edit',
            'suppliers.view',
            'suppliers.create',
            'suppliers.edit',
            'movements.view',
            'movements.create',
            'movements.export',
            'reports.view',
        ]);

        // Viewer: Solo lectura
        $viewerRole = Role::create(['name' => 'viewer']);
        $viewerRole->givePermissionTo([
            'dashboard.view',
            'products.view',
            'products.export',
            'categories.view',
            'suppliers.view',
            'movements.view',
            'movements.export',
            'reports.view',
        ]);
    }
}
