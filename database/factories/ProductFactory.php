<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory para generar productos de prueba.
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $costPrice = fake()->randomFloat(2, 10, 500);

        return [
            'sku' => fake()->unique()->bothify('SKU-####-???'),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->paragraph(),
            'category_id' => Category::factory(),
            'supplier_id' => Supplier::factory(),
            'cost_price' => $costPrice,
            'unit_price' => $costPrice * fake()->randomFloat(2, 1.2, 2.0), // Margen 20%-100%
            'stock_quantity' => fake()->numberBetween(0, 100),
            'min_stock' => fake()->numberBetween(5, 20),
            'is_active' => true,
        ];
    }

    /**
     * Indica que el producto está inactivo.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indica que el producto tiene stock bajo.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(0, 4),
            'min_stock' => 10,
        ]);
    }
}
