import axios from "axios";
import type { AuthUser, CreateUserRequest, UpdateUserRequest, UsersListResponse } from "../types/user";
import { API_URL } from "../utils/constants";

// Create axios instance with baseURL and token interceptor
const usersApi = axios.create({
    baseURL: `${API_URL}`,
});

// Interceptor to automatically add token to requests
usersApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
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

// Interfaz de respuesta del backend para listar usuarios
interface BackendUsersListResponse {
    data: Array<{
        id: number;
        name: string;
        email: string;
        role?: string;
        created_at?: string;
    }>;
    total: number;
    page: number;
    size: number;
}

/**
 * Get all users with pagination and filters
 * @param page - Page number (default: 0)
 * @param size - Items per page (default: 100)
 * @param orderBy - Field to order by (default: "id")
 * @param order - Order direction: ASC or DESC (default: "ASC")
 * @param filter - Text to filter by name or email (optional)
 * @returns Promise with users list and total count
 * 
 * Endpoint: GET /api/user/list
 */
export async function getUsers(
    page: number = 0,
    size: number = 100,
    orderBy: string = "id",
    order: "ASC" | "DESC" = "ASC",
    filter?: string
): Promise<UsersListResponse> {
    const params: Record<string, string | number> = {
        page,
        size,
        orderBy,
        order,
    };
    
    if (filter) {
        params.filter = filter;
    }
    
    const response = await usersApi.get<BackendUsersListResponse>('user/list', { params });
    
    // Transformar respuesta del backend al formato del frontend
    const users: AuthUser[] = response.data.data.map(user => ({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: (user.role || 'user') as AuthUser['role'],
        createdAt: user.created_at,
    }));
    
    return {
        users,
        total: response.data.total,
    };
}

/**
 * Get a single user by ID
 * @param id - User ID
 * @returns Promise with user data
 * 
 * NOTA: El backend no tiene endpoint específico para obtener usuario por ID.
 * Se obtiene de la lista de usuarios.
 */
export async function getUserById(id: string): Promise<AuthUser> {
    const response = await getUsers();
    const user = response.users.find(u => u.id === id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
}

/**
 * Create a new user
 * @param data - User creation data (name, email, password)
 * @returns Promise with created user data
 * 
 * Endpoint: POST /api/user
 * NOTA: El backend NO acepta el campo "role". Los usuarios se crean sin rol asignado.
 * Los roles deben asignarse manualmente desde el backend o base de datos.
 */
export async function createUser(data: CreateUserRequest): Promise<AuthUser> {
    // Llamar al backend: POST /api/user
    // El backend solo acepta: name, email, password (NO acepta role)
    const response = await usersApi.post<CreateUserResponse>('user', {
        name: data.name,
        email: data.email,
        password: data.password,
    });
    
    // Transformar respuesta del backend al tipo AuthUser
    const newUser: AuthUser = {
        id: String(response.data.id),
        name: response.data.name,
        email: response.data.email,
        role: (response.data.role || 'user') as AuthUser['role'],
        createdAt: new Date().toISOString(),
    };
    
    return newUser;
}

/**
 * Update an existing user
 * @param _id - User ID
 * @param _data - User update data (name, email, password, role)
 * @returns Promise with updated user data
 * 
 * ⚠️ ADVERTENCIA: El backend tiene el endpoint PUT /api/user pero está VACÍO (sin implementación).
 * Esta función lanzará un error hasta que el backend lo implemente.
 */
export async function updateUser(_id: string, _data: UpdateUserRequest): Promise<AuthUser> {
    // El backend tiene PUT /api/user pero está sin implementar
    throw new Error("La funcionalidad de editar usuarios aún no está implementada en el backend. Contacta al administrador del sistema.");
    
    // TODO: Descomentar cuando el backend implemente PUT /api/user
    /*
    const payload: Record<string, unknown> = { id: _id };
    if (_data.name) payload.name = _data.name;
    if (_data.email) payload.email = _data.email;
    if (_data.password) payload.password = _data.password;
    if (_data.role) payload.role = _data.role;
    
    const response = await usersApi.put<CreateUserResponse>('user', payload);
    
    return {
        id: String(response.data.id),
        name: response.data.name,
        email: response.data.email,
        role: (response.data.role || 'user') as AuthUser['role'],
        createdAt: new Date().toISOString(),
    };
    */
}

/**
 * Delete a user
 * @param id - User ID
 * @returns Promise that resolves when user is deleted
 * 
 * Endpoint: DELETE /api/user/{id}
 */
export async function deleteUser(id: string): Promise<void> {
    await usersApi.delete(`user/${id}`);
}
