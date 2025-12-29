<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación para crear/actualizar proveedores.
 */
class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('suppliers', 'name')->ignore($supplierId),
            ],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.unique' => 'Ya existe un proveedor con este nombre.',
            'contact_email.email' => 'El email no tiene un formato válido.',
        ];
    }
}
