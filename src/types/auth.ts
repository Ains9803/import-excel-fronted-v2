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
