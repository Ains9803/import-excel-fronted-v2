import type { AuthUser } from "@/types/user";

/**
 * Verifica si el usuario tiene rol de administrador
 */
export function isAdmin(user: AuthUser | null): boolean {
    return user?.role === 'admin';
}

/**
 * Verifica si el usuario puede gestionar otros usuarios
 * (actualmente solo los admins pueden hacerlo)
 */
export function canManageUsers(user: AuthUser | null): boolean {
    return isAdmin(user);
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
    return !!sessionStorage.getItem("token");
}
