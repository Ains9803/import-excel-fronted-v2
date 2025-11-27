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


export interface AuthContextType {
    user: AuthUser | null,
    loading: boolean,
    login: (data: LoginRequest) => Promise<void>,
    register: (data: RegisterRequest) => Promise<void>,
    logout: () => Promise<void>,
    refreshUser: () => Promise<void>,
}
