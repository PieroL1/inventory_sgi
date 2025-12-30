<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory para StockMovement.
 * Genera movimientos de stock para testing y seeding.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    /**
     * Define el estado por defecto del modelo.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'type' => $this->faker->randomElement(['entry', 'exit', 'adjustment']),
            'quantity' => $this->faker->numberBetween(1, 50),
            'reason' => $this->faker->optional(0.7)->sentence(),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Estado: Movimiento de entrada.
     */
    public function entry(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'entry',
            'quantity' => $this->faker->numberBetween(10, 100),
            'reason' => $this->faker->randomElement([
                'Llegó pedido del proveedor',
                'Reposición de inventario',
                'Devolución de cliente',
                'Ingreso inicial',
            ]),
        ]);
    }

    /**
     * Estado: Movimiento de salida.
     */
    public function exit(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'exit',
            'quantity' => $this->faker->numberBetween(1, 20),
            'reason' => $this->faker->randomElement([
                'Venta en tienda',
                'Envío a sucursal',
                'Muestra para cliente',
                'Producto dañado',
            ]),
        ]);
    }

    /**
     * Estado: Movimiento de ajuste.
     */
    public function adjustment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'adjustment',
            'quantity' => $this->faker->numberBetween(-10, 10),
            'reason' => $this->faker->randomElement([
                'Ajuste por inventario físico',
                'Corrección de error de captura',
                'Diferencia detectada en conteo',
                'Ajuste por merma',
            ]),
        ]);
    }
}
