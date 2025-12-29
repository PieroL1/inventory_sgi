<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para crear/actualizar categorías.
 */
class CategoryRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado.
     */
    public function authorize(): bool
    {
        return true; // Por ahora permitimos a todos, en Fase 5 se agregan permisos
    }

    /**
     * Reglas de validación.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Mensajes de error personalizados.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.unique' => 'Ya existe una categoría con este nombre.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'description.max' => 'La descripción no puede exceder 1000 caracteres.',
            'parent_id.exists' => 'La categoría padre seleccionada no existe.',
        ];
    }
}
