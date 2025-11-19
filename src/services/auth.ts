import axios from "axios";
import type {AuthResponse, LoginRequest, RegisterRequest} from "../types/auth.ts";
import {API_URL} from "../utils/constants.ts";

const authApi = axios.create({
    baseURL: `${API_URL}`,
});

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('token', data);
    return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('user', data);
    return response.data;
}