export type UserRole = 'admin' | 'user';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export interface UsersListResponse {
    users: AuthUser[];
    total: number;
}
