export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface AuthUser {
    id: string
    name: string
    email: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}