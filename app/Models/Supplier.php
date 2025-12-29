<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo de Proveedores.
 */
class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_email',
        'phone',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Productos de este proveedor.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
