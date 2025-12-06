import axios from "axios";
import type {AuthResponse, LoginRequest, AuthUser} from "../types/auth.ts";
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

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('token', data);
    return response.data;
}

export async function logout(): Promise<void> {
    await authApi.post('logout');
}

export async function getUser(): Promise<AuthUser> {
    const response = await authApi.get<AuthUser>('user');
    return response.data;
}