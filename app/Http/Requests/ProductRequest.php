<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para crear/actualizar productos.
 */
class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'cost_price' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'unit_price' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'min_stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'sku.required' => 'El SKU es obligatorio.',
            'sku.unique' => 'Ya existe un producto con este SKU.',
            'name.required' => 'El nombre es obligatorio.',
            'cost_price.required' => 'El precio de costo es obligatorio.',
            'cost_price.min' => 'El precio de costo no puede ser negativo.',
            'unit_price.required' => 'El precio de venta es obligatorio.',
            'unit_price.min' => 'El precio de venta no puede ser negativo.',
            'stock_quantity.required' => 'La cantidad en stock es obligatoria.',
            'stock_quantity.min' => 'El stock no puede ser negativo.',
            'min_stock.required' => 'El stock mínimo es obligatorio.',
            'min_stock.min' => 'El stock mínimo no puede ser negativo.',
        ];
    }
}
