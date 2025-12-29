<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo de Productos.
 * Contiene información de stock, precios y relaciones con categoría/proveedor.
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'category_id',
        'supplier_id',
        'cost_price',
        'unit_price',
        'stock_quantity',
        'min_stock',
        'is_active',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'min_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Categoría del producto.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Proveedor del producto.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Verifica si el stock está por debajo del mínimo.
     */
    public function isLowStock(): bool
    {
        return $this->stock_quantity < $this->min_stock;
    }

    /**
     * Calcula el margen de ganancia.
     */
    public function profitMargin(): float
    {
        if ($this->cost_price <= 0) {
            return 0;
        }
        return (($this->unit_price - $this->cost_price) / $this->cost_price) * 100;
    }
}
