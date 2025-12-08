import type { AuthUser } from './user';

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

// Re-export AuthUser from user.ts to maintain backward compatibility
export type { AuthUser } from './user';

// Respuesta REAL del backend para login
export interface BackendLoginResponse {
    status: number;
    message: string;
    error: boolean;
    token: string;
    user: string;      // ← Es un string (nombre del usuario), NO un objeto
    email: string;
    role: string;
    token_type: string;
}

// Respuesta transformada para uso interno en el frontend
export interface AuthResponse {
    token: string
    user: AuthUser
}

export interface AuthContextType {
    user: AuthUser | null,
    loading: boolean,
    login: (data: LoginRequest) => Promise<void>,
    logout: () => Promise<void>,
    refreshUser: () => Promise<void>,
}
