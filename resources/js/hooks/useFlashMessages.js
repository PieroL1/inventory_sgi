import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook para mostrar notificaciones toast basadas en flash messages de Laravel.
 * Usa los mensajes flash 'success', 'error', 'warning', 'info'.
 */
export function useFlashMessages() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);
}
