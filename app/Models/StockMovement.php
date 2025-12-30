<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

/**
 * Modelo de Movimientos de Stock.
 * Registra entradas, salidas y ajustes de inventario.
 */
class StockMovement extends Model
{
    use HasFactory;

    /**
     * Tipos de movimiento válidos.
     */
    public const TYPE_ENTRY = 'entry';
    public const TYPE_EXIT = 'exit';
    public const TYPE_ADJUSTMENT = 'adjustment';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'reason',
        'user_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Producto asociado al movimiento.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Usuario que registró el movimiento.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para filtrar por tipo de movimiento.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope para filtrar entradas.
     */
    public function scopeEntries(Builder $query): Builder
    {
        return $query->ofType(self::TYPE_ENTRY);
    }

    /**
     * Scope para filtrar salidas.
     */
    public function scopeExits(Builder $query): Builder
    {
        return $query->ofType(self::TYPE_EXIT);
    }

    /**
     * Scope para filtrar ajustes.
     */
    public function scopeAdjustments(Builder $query): Builder
    {
        return $query->ofType(self::TYPE_ADJUSTMENT);
    }

    /**
     * Obtiene la etiqueta legible del tipo de movimiento.
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_ENTRY => 'Entrada',
            self::TYPE_EXIT => 'Salida',
            self::TYPE_ADJUSTMENT => 'Ajuste',
            default => $this->type,
        };
    }

    /**
     * Obtiene los tipos de movimiento disponibles.
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_ENTRY => 'Entrada',
            self::TYPE_EXIT => 'Salida',
            self::TYPE_ADJUSTMENT => 'Ajuste',
        ];
    }
}
