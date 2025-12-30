import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, UserCog } from 'lucide-react';

/**
 * Página para editar un proveedor existente.
 */
export default function Edit({ supplier }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        contact_email: supplier.contact_email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        is_active: supplier.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', supplier.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('suppliers.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        Editar Proveedor
                    </h2>
                </div>
            }
        >
            <Head title={`Editar ${supplier.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCog className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                Editar: {supplier.name}
                            </CardTitle>
                            <CardDescription>
                                Modifica los datos del proveedor.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nombre <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Distribuidora ABC"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email y Teléfono en grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email">Email de Contacto</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            placeholder="contacto@proveedor.com"
                                            className={errors.contact_email ? 'border-red-500' : ''}
                                        />
                                        {errors.contact_email && (
                                            <p className="text-sm text-red-500">{errors.contact_email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+52 555 123 4567"
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Calle, número, colonia, ciudad..."
                                        rows={3}
                                        className={errors.address ? 'border-red-500' : ''}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-500">{errors.address}</p>
                                    )}
                                </div>

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
                                        Proveedor activo
                                    </Label>
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Link href={route('suppliers.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
