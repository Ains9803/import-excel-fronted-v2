import {useState, useEffect} from "react";
import type { AuthUser, LoginRequest, RegisterRequest} from "../types/auth.ts";
import {login as apiLogin, register as apiRegister, logout as apiLogout, getUser as apiGetUser} from "../services/auth.ts";
import { AuthContext } from "@/context/AuthContext.ts";


export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Verificar token y obtener datos actualizados del usuario
                    const userData = await apiGetUser();
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                } catch {
                    // Token inválido, limpiar localStorage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        
        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        const authResponse = await apiLogin(data);
        if (authResponse) {
            localStorage.setItem("user", JSON.stringify(authResponse.user));
            localStorage.setItem("token", authResponse.token);
            setUser(authResponse.user);
        }
    }

    const register = async (data: RegisterRequest) => {
        const registerResponse = await apiRegister(data);
        if (registerResponse) {
            localStorage.setItem("user", JSON.stringify(registerResponse.user));
            localStorage.setItem("token", registerResponse.token);
            setUser(registerResponse.user);
        }
    }

    const logout = async () => {
        try {
            // Llamar al endpoint de logout en el backend
            await apiLogout();
        } catch (error) {
            console.error("Error al hacer logout:", error);
        } finally {
            // Siempre limpiar el estado local
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
    }

    const refreshUser = async () => {
        try {
            const userData = await apiGetUser();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Error al actualizar datos del usuario:", error);
            // Si falla, hacer logout
            await logout();
        }
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout, refreshUser}}>
            {children}
        </AuthContext.Provider>
    )
}

