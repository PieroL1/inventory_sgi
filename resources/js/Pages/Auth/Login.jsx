import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Bienvenido de nuevo
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Ingresa tus credenciales para acceder al sistema
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 p-4">
                    <p className="text-sm font-medium text-success-700 dark:text-success-400">
                        {status}
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                        Correo electrónico
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            autoComplete="username"
                            autoFocus
                            placeholder="correo@ejemplo.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                            Contraseña
                        </Label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={`pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) => setData('remember', checked)}
                        className="border-gray-300 dark:border-gray-600"
                    />
                    <Label
                        htmlFor="remember"
                        className="text-sm text-gray-600 dark:text-gray-400 font-normal cursor-pointer"
                    >
                        Recordar mi sesión
                    </Label>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Ingresando...
                        </>
                    ) : (
                        <>
                            <LogIn className="mr-2 h-5 w-5" />
                            Iniciar Sesión
                        </>
                    )}
                </Button>
            </form>

            {/* Demo credentials hint (remover en producción) */}
            <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
                    Credenciales de prueba:
                </p>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 font-mono">
                    <p>Admin: admin@sgi.test / password</p>
                    <p>Operador: operador@sgi.test / password</p>
                    <p>Visor: viewer@sgi.test / password</p>
                </div>
            </div>
        </GuestLayout>
    );
}

