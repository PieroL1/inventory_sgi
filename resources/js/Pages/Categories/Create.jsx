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
import { ArrowLeft, Save, FolderPlus } from 'lucide-react';

/**
 * Página para crear una nueva categoría.
 * Formulario con validación y feedback visual.
 */
export default function Create({ parentCategories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        parent_id: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
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
                        Nueva Categoría
                    </h2>
                </div>
            }
        >
            <Head title="Nueva Categoría" />

            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderPlus className="h-5 w-5 text-primary-600" />
                                Crear Categoría
                            </CardTitle>
                            <CardDescription>
                                Completa los datos para crear una nueva categoría de productos.
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
                                        value={data.parent_id}
                                        onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}
                                    >
                                        <SelectTrigger className={errors.parent_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecciona una categoría padre (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin categoría padre</SelectItem>
                                            {parentCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="text-sm text-red-500">{errors.parent_id}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Deja vacío para crear una categoría principal.
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
                                        {processing ? 'Guardando...' : 'Guardar Categoría'}
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
