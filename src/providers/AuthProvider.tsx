import {useState, useEffect} from "react";
import type { AuthUser, LoginRequest, RegisterRequest} from "../types/auth.ts";
import {login as apiLogin, register as apiRegister, logout as apiLogout, getUser as apiGetUser} from "../services/auth.ts";
import { AuthContext } from "@/context/AuthContext.ts";


export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    const userData = await apiGetUser();
                    setUser(userData);
                    sessionStorage.setItem("user", JSON.stringify(userData));
                } catch {
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
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
            sessionStorage.setItem("user", JSON.stringify(authResponse.user));
            sessionStorage.setItem("token", authResponse.token);
            setUser(authResponse.user);
        }
    }

    const register = async (data: RegisterRequest) => {
        const registerResponse = await apiRegister(data);
        if (registerResponse) {
            sessionStorage.setItem("user", JSON.stringify(registerResponse.user));
            sessionStorage.setItem("token", registerResponse.token);
            setUser(registerResponse.user);
        }
    }

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Error al hacer logout:", error);
        } finally {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            setUser(null);
        }
    }

    const refreshUser = async () => {
        try {
            const userData = await apiGetUser();
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Error al actualizar datos del usuario:", error);
            await logout();
        }
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout, refreshUser}}>
            {children}
        </AuthContext.Provider>
    )
}

