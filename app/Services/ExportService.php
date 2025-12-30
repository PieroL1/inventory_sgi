<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Servicio para exportación de datos a CSV.
 */
class ExportService
{
    /**
     * Exporta productos a CSV con los filtros aplicados.
     */
    public function exportProducts(Request $request): StreamedResponse
    {
        $query = Product::with(['category', 'supplier']);

        // Aplicar los mismos filtros del listado
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category')) {
            $query->where('category_id', $categoryId);
        }

        if ($supplierId = $request->input('supplier')) {
            $query->where('supplier_id', $supplierId);
        }

        if ($request->has('status') && $request->input('status') !== '') {
            $query->where('is_active', $request->boolean('status'));
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('stock_quantity', '<', 'min_stock');
        }

        $products = $query->orderBy('name')->get();

        $filename = 'productos_' . date('Y-m-d_H-i-s') . '.csv';

        return new StreamedResponse(function () use ($products) {
            $handle = fopen('php://output', 'w');

            // BOM para UTF-8 en Excel
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Encabezados
            fputcsv($handle, [
                'SKU',
                'Nombre',
                'Descripción',
                'Categoría',
                'Proveedor',
                'Precio Costo',
                'Precio Venta',
                'Stock Actual',
                'Stock Mínimo',
                'Stock Bajo',
                'Estado',
                'Valor Inventario (Costo)',
                'Valor Inventario (Venta)',
                'Fecha Creación',
            ], ';');

            foreach ($products as $product) {
                fputcsv($handle, [
                    $product->sku,
                    $product->name,
                    $product->description ?? '',
                    $product->category?->name ?? '',
                    $product->supplier?->name ?? '',
                    number_format($product->cost_price, 2, ',', ''),
                    number_format($product->unit_price, 2, ',', ''),
                    $product->stock_quantity,
                    $product->min_stock,
                    $product->stock_quantity < $product->min_stock ? 'Sí' : 'No',
                    $product->is_active ? 'Activo' : 'Inactivo',
                    number_format($product->stock_quantity * $product->cost_price, 2, ',', ''),
                    number_format($product->stock_quantity * $product->unit_price, 2, ',', ''),
                    $product->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Exporta movimientos de stock a CSV con los filtros aplicados.
     */
    public function exportMovements(Request $request): StreamedResponse
    {
        $query = StockMovement::with(['product', 'user']);

        // Aplicar los mismos filtros del listado
        if ($productId = $request->input('product')) {
            $query->where('product_id', $productId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $movements = $query->orderBy('created_at', 'desc')->get();

        $filename = 'movimientos_' . date('Y-m-d_H-i-s') . '.csv';

        return new StreamedResponse(function () use ($movements) {
            $handle = fopen('php://output', 'w');

            // BOM para UTF-8 en Excel
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Encabezados
            fputcsv($handle, [
                'Fecha',
                'Producto SKU',
                'Producto Nombre',
                'Tipo',
                'Cantidad',
                'Motivo',
                'Usuario',
            ], ';');

            $typeLabels = [
                'entry' => 'Entrada',
                'exit' => 'Salida',
                'adjustment' => 'Ajuste',
            ];

            foreach ($movements as $movement) {
                fputcsv($handle, [
                    $movement->created_at->format('d/m/Y H:i'),
                    $movement->product?->sku ?? '',
                    $movement->product?->name ?? '',
                    $typeLabels[$movement->type] ?? $movement->type,
                    $movement->quantity,
                    $movement->reason ?? '',
                    $movement->user?->name ?? 'Sistema',
                ], ';');
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
