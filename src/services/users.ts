import axios from "axios";
import type { AuthUser, CreateUserRequest, UpdateUserRequest, UsersListResponse } from "../types/user";
import { API_URL } from "../utils/constants";

// ⚠️ PRODUCCIÓN: Cambiar a false para usar API real
// TODO: Cambiar DEV_MODE a false antes de desplegar a producción
const DEV_MODE = true;

// Datos mock para desarrollo
const mockUsers: AuthUser[] = [
    {
        id: "dev-admin-123",
        name: "Admin de Desarrollo",
        email: "admin@dev.com",
        role: "admin",
        createdAt: "2024-01-15T10:30:00Z",
    },
    {
        id: "user-001",
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        role: "user",
        createdAt: "2024-02-20T14:45:00Z",
    },
    {
        id: "user-002",
        name: "María García",
        email: "maria.garcia@example.com",
        role: "admin",
        createdAt: "2024-03-10T09:15:00Z",
    },
    {
        id: "user-003",
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@example.com",
        role: "user",
        createdAt: "2024-03-25T16:20:00Z",
    },
];

// Create axios instance with baseURL and token interceptor
const usersApi = axios.create({
    baseURL: `${API_URL}`,
});

// Interceptor to automatically add token to requests
usersApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Get all users
 * @returns Promise with users list and total count
 */
export async function getUsers(): Promise<UsersListResponse> {
    if (DEV_MODE) {
        // MODO DESARROLLO: Datos mock
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            users: mockUsers,
            total: mockUsers.length,
        };
    }
    // PRODUCCIÓN: Llamada real al backend
    const response = await usersApi.get<UsersListResponse>('users');
    return response.data;
}

/**
 * Get a single user by ID
 * @param id - User ID
 * @returns Promise with user data
 */
export async function getUserById(id: string): Promise<AuthUser> {
    if (DEV_MODE) {
        // MODO DESARROLLO: Datos mock
        await new Promise(resolve => setTimeout(resolve, 300));
        const user = mockUsers.find(u => u.id === id);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
    // PRODUCCIÓN: Llamada real al backend
    const response = await usersApi.get<AuthUser>(`users/${id}`);
    return response.data;
}

/**
 * Create a new user
 * @param data - User creation data (name, email, password, role)
 * @returns Promise with created user data
 */
export async function createUser(data: CreateUserRequest): Promise<AuthUser> {
    if (DEV_MODE) {
        // MODO DESARROLLO: Datos mock
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verificar email único
        if (mockUsers.some(u => u.email === data.email)) {
            throw {
                response: {
                    data: {
                        message: "El email ya está registrado",
                    },
                },
            };
        }
        
        const newUser: AuthUser = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
    }
    // PRODUCCIÓN: Llamada real al backend
    const response = await usersApi.post<AuthUser>('users', data);
    return response.data;
}

/**
 * Update an existing user
 * @param id - User ID
 * @param data - User update data (name, email, password, role)
 * @returns Promise with updated user data
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<AuthUser> {
    if (DEV_MODE) {
        // MODO DESARROLLO: Datos mock
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Usuario no encontrado");
        }
        
        // Verificar email único (excepto el email actual del usuario)
        if (data.email && mockUsers.some(u => u.email === data.email && u.id !== id)) {
            throw {
                response: {
                    data: {
                        message: "El email ya está registrado",
                    },
                },
            };
        }
        
        const updatedUser: AuthUser = {
            ...mockUsers[userIndex],
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.role && { role: data.role }),
        };
        mockUsers[userIndex] = updatedUser;
        return updatedUser;
    }
    // PRODUCCIÓN: Llamada real al backend
    const response = await usersApi.put<AuthUser>(`users/${id}`, data);
    return response.data;
}

/**
 * Delete a user
 * @param id - User ID
 * @returns Promise that resolves when user is deleted
 */
export async function deleteUser(id: string): Promise<void> {
    if (DEV_MODE) {
        // MODO DESARROLLO: Datos mock
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Usuario no encontrado");
        }
        
        mockUsers.splice(userIndex, 1);
        return;
    }
    // PRODUCCIÓN: Llamada real al backend
    await usersApi.delete(`users/${id}`);
}
