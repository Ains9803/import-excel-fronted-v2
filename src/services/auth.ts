import axios from "axios";
import type {AuthResponse, BackendLoginResponse, LoginRequest, AuthUser} from "../types/auth.ts";
import type {UserRole} from "../types/user.ts";
import {API_URL} from "../utils/constants.ts";

const authApi = axios.create({
    baseURL: `${API_URL}`,
});

// Interceptor para agregar token automáticamente
authApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
authApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token inválido o expirado, limpiar sesión
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<BackendLoginResponse>('token', data);
    
    // Verificar si el backend devolvió un error
    if (response.data.error) {
        throw new Error(response.data.message);
    }
    
    // Transformar respuesta del backend al formato esperado por el frontend
    return {
        token: response.data.token,
        user: {
            id: '', // El backend NO devuelve ID en el login, se obtendrá después con getUser()
            name: response.data.user,  // ← El backend devuelve el nombre como string
            email: response.data.email,
            role: response.data.role as UserRole,
        }
    };
}

export async function logout(): Promise<void> {
    await authApi.post('logout');
}

export async function getUser(): Promise<AuthUser> {
    const response = await authApi.get('user');
    
    // Transformar respuesta del backend (id es number) al formato del frontend (id es string)
    return {
        id: String(response.data.id),
        name: response.data.name,
        email: response.data.email,
        role: response.data.role as UserRole,
        createdAt: response.data.created_at,
    };
}