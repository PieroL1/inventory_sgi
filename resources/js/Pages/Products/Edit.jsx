import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Package } from 'lucide-react';

/**
 * Página para editar un producto existente.
 */
export default function Edit({ product, categories, suppliers }) {
    const { data, setData, put, processing, errors } = useForm({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id?.toString() || '',
        supplier_id: product.supplier_id?.toString() || '',
        cost_price: product.cost_price?.toString() || '',
        unit_price: product.unit_price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        min_stock: product.min_stock?.toString() || '5',
        is_active: product.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('products.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar Producto
                    </h2>
                </div>
            }
        >
            <Head title={`Editar - ${product.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary-600" />
                                Editar Producto
                            </CardTitle>
                            <CardDescription>
                                Modifica los datos del producto <strong>{product.name}</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Información básica */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Información Básica
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sku">
                                                SKU <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="sku"
                                                type="text"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value.toUpperCase())}
                                                placeholder="SKU-0001"
                                                className={errors.sku ? 'border-red-500' : ''}
                                            />
                                            {errors.sku && (
                                                <p className="text-sm text-red-500">{errors.sku}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="name">
                                                Nombre <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Nombre del producto"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Descripción detallada del producto..."
                                            rows={3}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Clasificación */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Clasificación
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category_id">Categoría</Label>
                                            <Select
                                                value={data.category_id}
                                                onValueChange={(value) => setData('category_id', value === 'none' ? '' : value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin categoría</SelectItem>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="supplier_id">Proveedor</Label>
                                            <Select
                                                value={data.supplier_id}
                                                onValueChange={(value) => setData('supplier_id', value === 'none' ? '' : value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un proveedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin proveedor</SelectItem>
                                                    {suppliers.map((supplier) => (
                                                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                            {supplier.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Precios */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Precios
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cost_price">
                                                Precio de Costo <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    id="cost_price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.cost_price}
                                                    onChange={(e) => setData('cost_price', e.target.value)}
                                                    placeholder="0.00"
                                                    className={`pl-7 ${errors.cost_price ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.cost_price && (
                                                <p className="text-sm text-red-500">{errors.cost_price}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="unit_price">
                                                Precio de Venta <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    id="unit_price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.unit_price}
                                                    onChange={(e) => setData('unit_price', e.target.value)}
                                                    placeholder="0.00"
                                                    className={`pl-7 ${errors.unit_price ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.unit_price && (
                                                <p className="text-sm text-red-500">{errors.unit_price}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Stock */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                                        Inventario
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="stock_quantity">
                                                Stock Actual <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="stock_quantity"
                                                type="number"
                                                min="0"
                                                value={data.stock_quantity}
                                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                                className={errors.stock_quantity ? 'border-red-500' : ''}
                                            />
                                            {errors.stock_quantity && (
                                                <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="min_stock">
                                                Stock Mínimo <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="min_stock"
                                                type="number"
                                                min="0"
                                                value={data.min_stock}
                                                onChange={(e) => setData('min_stock', e.target.value)}
                                                className={errors.min_stock ? 'border-red-500' : ''}
                                            />
                                            {errors.min_stock && (
                                                <p className="text-sm text-red-500">{errors.min_stock}</p>
                                            )}
                                            <p className="text-sm text-gray-500">
                                                Se mostrará alerta cuando el stock esté por debajo de este valor.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Estado Activo */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer">
                                        Producto activo
                                    </Label>
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Link href={route('products.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Guardando...' : 'Actualizar Producto'}
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
