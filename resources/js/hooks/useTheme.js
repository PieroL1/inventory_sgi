import { useState, useEffect } from 'react';

/**
 * Hook para manejar el tema (claro/oscuro) de la aplicación
 * Persiste la preferencia en localStorage y respeta la preferencia del sistema
 */
export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Intentar obtener del localStorage primero
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored) return stored;
            
            // Si no hay preferencia guardada, usar la del sistema
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remover ambas clases y agregar la correcta
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        // Guardar en localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Escuchar cambios en la preferencia del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Solo cambiar automáticamente si no hay preferencia guardada
            const stored = localStorage.getItem('theme');
            if (!stored) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setLightTheme = () => setTheme('light');
    const setDarkTheme = () => setTheme('dark');
    const setSystemTheme = () => {
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    };

    return {
        theme,
        setTheme,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
    };
}

export default useTheme;
