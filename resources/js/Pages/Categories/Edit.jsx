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
import { ArrowLeft, Save, FolderEdit } from 'lucide-react';

/**
 * Página para editar una categoría existente.
 */
export default function Edit({ category, parentCategories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        parent_id: category.parent_id?.toString() || '',
        is_active: category.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('categories.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar Categoría
                    </h2>
                </div>
            }
        >
            <Head title={`Editar ${category.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderEdit className="h-5 w-5 text-primary-600" />
                                Editar: {category.name}
                            </CardTitle>
                            <CardDescription>
                                Modifica los datos de la categoría.
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
                                        placeholder="Ej: Electrónicos"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe brevemente esta categoría..."
                                        rows={3}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                {/* Categoría Padre */}
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Categoría Padre</Label>
                                    <Select
                                        value={data.parent_id || 'none'}
                                        onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}
                                    >
                                        <SelectTrigger className={errors.parent_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecciona una categoría padre (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin categoría padre</SelectItem>
                                            {parentCategories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="text-sm text-red-500">{errors.parent_id}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Deja vacío para que sea una categoría principal.
                                    </p>
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
                                        Categoría activa
                                    </Label>
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Link href={route('categories.index')}>
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
