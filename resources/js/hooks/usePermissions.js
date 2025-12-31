import { usePage } from '@inertiajs/react';

/**
 * Hook para verificar permisos del usuario actual.
 * Usa los permisos compartidos desde HandleInertiaRequests.
 * 
 * Uso:
 *   const { can, hasRole, isAdmin } = usePermissions();
 *   if (can('products.create')) { ... }
 *   if (hasRole('admin')) { ... }
 */
export function usePermissions() {
    const { auth } = usePage().props;
    
    const permissions = auth?.can || {};
    const roles = auth?.roles || [];

    /**
     * Verifica si el usuario tiene un permiso específico.
     * @param {string} permission - Nombre del permiso (ej: 'products.create')
     * @returns {boolean}
     */
    const can = (permission) => {
        return permissions[permission] === true;
    };

    /**
     * Verifica si el usuario tiene alguno de los permisos dados.
     * @param {string[]} permissionList - Lista de permisos
     * @returns {boolean}
     */
    const canAny = (permissionList) => {
        return permissionList.some(p => permissions[p] === true);
    };

    /**
     * Verifica si el usuario tiene todos los permisos dados.
     * @param {string[]} permissionList - Lista de permisos
     * @returns {boolean}
     */
    const canAll = (permissionList) => {
        return permissionList.every(p => permissions[p] === true);
    };

    /**
     * Verifica si el usuario tiene un rol específico.
     * @param {string} role - Nombre del rol (ej: 'admin')
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return roles.includes(role);
    };

    /**
     * Verifica si el usuario tiene alguno de los roles dados.
     * @param {string[]} roleList - Lista de roles
     * @returns {boolean}
     */
    const hasAnyRole = (roleList) => {
        return roleList.some(r => roles.includes(r));
    };

    return {
        can,
        canAny,
        canAll,
        hasRole,
        hasAnyRole,
        isAdmin: hasRole('admin'),
        isOperator: hasRole('operator'),
        isViewer: hasRole('viewer'),
        permissions,
        roles,
    };
}
