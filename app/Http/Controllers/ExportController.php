<?php

namespace App\Http\Controllers;

use App\Services\ExportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Controlador para exportación de datos.
 */
class ExportController extends Controller
{
    public function __construct(
        private ExportService $exportService
    ) {}

    /**
     * Exporta productos a CSV.
     */
    public function products(Request $request): StreamedResponse
    {
        return $this->exportService->exportProducts($request);
    }

    /**
     * Exporta movimientos de stock a CSV.
     */
    public function movements(Request $request): StreamedResponse
    {
        return $this->exportService->exportMovements($request);
    }
}
