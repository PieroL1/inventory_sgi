import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ProductCombobox } from '@/Components/ProductCombobox';
import {
    ArrowLeft,
    Save,
    ArrowLeftRight,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Página para crear un nuevo movimiento de stock.
 */
export default function Create({ products, types, preselectedProduct }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: preselectedProduct || '',
        type: '',
        quantity: '',
        reason: '',
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    // Actualizar producto seleccionado cuando cambia
    useEffect(() => {
        if (data.product_id) {
            const product = products.find(p => p.id === parseInt(data.product_id));
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
    }, [data.product_id, products]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('stock-movements.store'));
    };

    const getTypeIcon = (typeValue) => {
        switch (typeValue) {
            case 'entry':
                return <ArrowUpCircle className="h-5 w-5 text-emerald-500" />;
            case 'exit':
                return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
            case 'adjustment':
                return <RefreshCw className="h-5 w-5 text-amber-500" />;
            default:
                return null;
        }
    };

    const getTypeDescription = (typeValue) => {
        switch (typeValue) {
            case 'entry':
                return 'Suma unidades al stock actual';
            case 'exit':
                return 'Resta unidades del stock actual';
            case 'adjustment':
                return 'Usa valores positivos para sumar o negativos para restar';
            default:
                return '';
        }
    };

    // Calcular el nuevo stock proyectado
    const calculateProjectedStock = () => {
        if (!selectedProduct || !data.quantity || !data.type) return null;
        const qty = parseInt(data.quantity) || 0;
        const current = selectedProduct.stock_quantity;
        
        switch (data.type) {
            case 'entry':
                return current + Math.abs(qty);
            case 'exit':
                return current - Math.abs(qty);
            case 'adjustment':
                return current + qty;
            default:
                return current;
        }
    };

    const projectedStock = calculateProjectedStock();
    const willBeNegative = projectedStock !== null && projectedStock < 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('stock-movements.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Nuevo Movimiento de Stock
                    </h2>
                </div>
            }
        >
            <Head title="Nuevo Movimiento" />

            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowLeftRight className="h-5 w-5 text-primary-600" />
                                Registrar Movimiento
                            </CardTitle>
                            <CardDescription>
                                Registra una entrada, salida o ajuste de inventario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selección de Producto */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Producto
                                    </h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="product_id">
                                            Seleccionar Producto <span className="text-red-500">*</span>
                                        </Label>
                                        <ProductCombobox
                                            products={products}
                                            value={data.product_id}
                                            onValueChange={(value) => setData('product_id', value)}
                                            placeholder="Seleccionar producto..."
                                            error={!!errors.product_id}
                                        />
                                        {errors.product_id && (
                                            <p className="text-sm text-red-500">{errors.product_id}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Tipo de Movimiento */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Tipo de Movimiento
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {Object.entries(types).map(([value, label]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setData('type', value)}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                                    data.type === value
                                                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    {getTypeIcon(value)}
                                                    <span className="font-medium text-gray-900">{label}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {getTypeDescription(value)}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && (
                                        <p className="text-sm text-red-500 mt-2">{errors.type}</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Cantidad */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Cantidad
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">
                                                Cantidad <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', e.target.value)}
                                                placeholder={data.type === 'adjustment' ? '-10 o +10' : '0'}
                                                className={`text-lg ${errors.quantity ? 'border-red-500' : ''}`}
                                                min={data.type !== 'adjustment' ? 1 : undefined}
                                            />
                                            {errors.quantity && (
                                                <p className="text-sm text-red-500">{errors.quantity}</p>
                                            )}
                                            {data.type === 'adjustment' && (
                                                <p className="text-xs text-gray-500">
                                                    Para ajustes, usa números negativos para restar stock.
                                                </p>
                                            )}
                                        </div>

                                        {/* Vista previa del resultado */}
                                        {selectedProduct && data.quantity && data.type && (
                                            <div className={`p-4 rounded-xl border ${
                                                willBeNegative 
                                                    ? 'bg-red-50 border-red-200' 
                                                    : 'bg-emerald-50 border-emerald-200'
                                            }`}>
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Stock proyectado
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">
                                                        {selectedProduct.stock_quantity}
                                                    </span>
                                                    <span className="text-gray-400">→</span>
                                                    <span className={`text-2xl font-bold ${
                                                        willBeNegative ? 'text-red-600' : 'text-emerald-600'
                                                    }`}>
                                                        {projectedStock}
                                                    </span>
                                                </div>
                                                {willBeNegative && (
                                                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span>El stock no puede ser negativo</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Razón */}
                                <div className="space-y-2">
                                    <Label htmlFor="reason">
                                        Razón / Descripción
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Describe el motivo del movimiento (ej: Llegó pedido del proveedor, venta en tienda, ajuste por inventario físico...)"
                                        rows={3}
                                        className={errors.reason ? 'border-red-500' : ''}
                                    />
                                    {errors.reason && (
                                        <p className="text-sm text-red-500">{errors.reason}</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-4">
                                    <Link href={route('stock-movements.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing || willBeNegative}
                                        className="gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Registrar Movimiento
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
