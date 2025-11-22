import {createContext, useContext, useState, useEffect} from "react";
import type {AuthUser, LoginRequest, RegisterRequest} from "../types/auth.ts";
import {login as apiLogin, register as apiRegister} from "../services/auth.ts";

interface AuthContextType {
    user: AuthUser | null,
    loading: boolean,
    login: (data: LoginRequest) => Promise<void>,
    register: (data: RegisterRequest) => Promise<void>,
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (userData && token) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
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
            setUser(registerResponse.user);
        }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return ctx;
}