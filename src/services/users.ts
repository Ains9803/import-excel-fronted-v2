import axios from "axios";
import type { AuthUser, CreateUserRequest, UpdateUserRequest, UsersListResponse } from "../types/user";
import { API_URL } from "../utils/constants";

// Datos mock para funciones no soportadas por el backend
// El backend solo soporta: POST /api/user (crear) y GET /api/user (usuario actual)
// TODO: Actualizar cuando el backend implemente los endpoints de listar, actualizar y eliminar
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

// Interfaz de respuesta del backend para crear usuario
interface CreateUserResponse {
    name: string;
    email: string;
    id: number;
    role: string;
}

/**
 * Get all users
 * @returns Promise with users list and total count
 * 
 * NOTA: El backend no tiene endpoint para listar usuarios.
 * Se usa mock data hasta que se implemente GET /api/users
 */
export async function getUsers(): Promise<UsersListResponse> {
    // TODO: Cambiar a llamada real cuando el backend implemente GET /api/users
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        users: mockUsers,
        total: mockUsers.length,
    };
}

/**
 * Get a single user by ID
 * @param id - User ID
 * @returns Promise with user data
 * 
 * NOTA: El backend no tiene endpoint para obtener usuario por ID.
 * Se usa mock data hasta que se implemente GET /api/users/{id}
 */
export async function getUserById(id: string): Promise<AuthUser> {
    // TODO: Cambiar a llamada real cuando el backend implemente GET /api/users/{id}
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
}

/**
 * Create a new user
 * @param data - User creation data (name, email, password, role)
 * @returns Promise with created user data
 * 
 * Usa el endpoint real: POST /api/user
 */
export async function createUser(data: CreateUserRequest): Promise<AuthUser> {
    // Llamada real al backend: POST /api/user
    const response = await usersApi.post<CreateUserResponse>('/api/user', {
        name: data.name,
        email: data.email,
        password: data.password,
    });
    
    // Transformar respuesta del backend al tipo AuthUser
    const newUser: AuthUser = {
        id: String(response.data.id),
        name: response.data.name,
        email: response.data.email,
        role: (response.data.role || data.role || 'user') as AuthUser['role'],
        createdAt: new Date().toISOString(),
    };
    
    // Agregar al mock para que aparezca en la lista
    mockUsers.push(newUser);
    
    return newUser;
}

/**
 * Update an existing user
 * @param id - User ID
 * @param data - User update data (name, email, password, role)
 * @returns Promise with updated user data
 * 
 * NOTA: El backend no tiene endpoint para actualizar usuarios.
 * Se usa mock data hasta que se implemente PUT /api/users/{id}
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<AuthUser> {
    // TODO: Cambiar a llamada real cuando el backend implemente PUT /api/users/{id}
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

/**
 * Delete a user
 * @param id - User ID
 * @returns Promise that resolves when user is deleted
 * 
 * NOTA: El backend no tiene endpoint para eliminar usuarios.
 * Se usa mock data hasta que se implemente DELETE /api/users/{id}
 */
export async function deleteUser(id: string): Promise<void> {
    // TODO: Cambiar a llamada real cuando el backend implemente DELETE /api/users/{id}
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
    }
    
    mockUsers.splice(userIndex, 1);
}
