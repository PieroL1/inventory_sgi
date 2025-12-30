<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Servicio para gestionar movimientos de stock.
 * Centraliza la lógica de negocio para entradas, salidas y ajustes de inventario.
 */
class StockService
{
    /**
     * Registra un movimiento de stock y actualiza la cantidad del producto.
     *
     * @param Product $product Producto afectado
     * @param string $type Tipo de movimiento (entry/exit/adjustment)
     * @param int $quantity Cantidad del movimiento
     * @param string|null $reason Razón del movimiento
     * @param User $user Usuario que registra el movimiento
     * @return StockMovement El movimiento creado
     * @throws InvalidArgumentException Si el movimiento no es válido
     */
    public function registerMovement(
        Product $product,
        string $type,
        int $quantity,
        ?string $reason,
        User $user
    ): StockMovement {
        // Validar tipo de movimiento
        if (!in_array($type, [StockMovement::TYPE_ENTRY, StockMovement::TYPE_EXIT, StockMovement::TYPE_ADJUSTMENT])) {
            throw new InvalidArgumentException("Tipo de movimiento inválido: {$type}");
        }

        // Validar cantidad según el tipo
        if ($type !== StockMovement::TYPE_ADJUSTMENT && $quantity <= 0) {
            throw new InvalidArgumentException("La cantidad debe ser mayor a 0 para entradas y salidas.");
        }

        // Para ajustes, la cantidad puede ser positiva o negativa (pero no 0)
        if ($type === StockMovement::TYPE_ADJUSTMENT && $quantity === 0) {
            throw new InvalidArgumentException("La cantidad del ajuste no puede ser 0.");
        }

        // Calcular el nuevo stock
        $newStock = $this->calculateNewStock($product, $type, $quantity);

        // Validar que no quede stock negativo
        if ($newStock < 0) {
            throw new InvalidArgumentException(
                "No hay suficiente stock. Stock actual: {$product->stock_quantity}, " .
                "cantidad solicitada: {$quantity}. El stock no puede ser negativo."
            );
        }

        // Usar transacción para garantizar integridad
        $movement = DB::transaction(function () use ($product, $type, $quantity, $reason, $user, $newStock) {
            // Crear el movimiento
            $movement = StockMovement::create([
                'product_id' => $product->id,
                'type' => $type,
                'quantity' => $quantity,
                'reason' => $reason,
                'user_id' => $user->id,
            ]);

            // Actualizar stock del producto
            $product->update(['stock_quantity' => $newStock]);

            return $movement;
        });

        // Refrescar el producto para obtener el stock actualizado
        $product->refresh();

        // Agregar información de alerta al movimiento (como propiedad dinámica)
        $movement->lowStockAlert = $product->isLowStock();
        $movement->productName = $product->name;
        $movement->newStock = $product->stock_quantity;
        $movement->minStock = $product->min_stock;

        return $movement;
    }

    /**
     * Calcula el nuevo stock basado en el tipo de movimiento.
     */
    private function calculateNewStock(Product $product, string $type, int $quantity): int
    {
        return match ($type) {
            StockMovement::TYPE_ENTRY => $product->stock_quantity + $quantity,
            StockMovement::TYPE_EXIT => $product->stock_quantity - $quantity,
            StockMovement::TYPE_ADJUSTMENT => $product->stock_quantity + $quantity, // Ajuste puede ser + o -
            default => $product->stock_quantity,
        };
    }

    /**
     * Registra una entrada de stock (método de conveniencia).
     */
    public function registerEntry(Product $product, int $quantity, ?string $reason, User $user): StockMovement
    {
        return $this->registerMovement($product, StockMovement::TYPE_ENTRY, $quantity, $reason, $user);
    }

    /**
     * Registra una salida de stock (método de conveniencia).
     */
    public function registerExit(Product $product, int $quantity, ?string $reason, User $user): StockMovement
    {
        return $this->registerMovement($product, StockMovement::TYPE_EXIT, $quantity, $reason, $user);
    }

    /**
     * Registra un ajuste de stock (método de conveniencia).
     * La cantidad puede ser positiva (agregar) o negativa (restar).
     */
    public function registerAdjustment(Product $product, int $quantity, ?string $reason, User $user): StockMovement
    {
        return $this->registerMovement($product, StockMovement::TYPE_ADJUSTMENT, $quantity, $reason, $user);
    }
}
