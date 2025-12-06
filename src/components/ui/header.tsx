import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FileSpreadsheet, LogOut, User, Users, Home, ChevronDown, Menu } from "lucide-react";
import { Button } from "./button";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleNavigation = (path: string) => {
        navigate(path);
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    return (
        <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-md backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center max-w-[1280px]">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <FileSpreadsheet className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">
                            Excel Importer
                        </h1>
                        <p className="text-xs text-green-50 hidden sm:block">
                            Gestión de datos simplificada
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Nombre de usuario (solo desktop) */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        <span className="text-sm font-medium text-white">
                            {user?.name || user?.email || "Usuario"}
                        </span>
                    </div>

                    {/* Menú Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <Button
                            onClick={() => setMenuOpen(!menuOpen)}
                            variant="outline"
                            size="sm"
                            className="text-sm cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                        >
                            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline ml-2">Menú</span>
                            <ChevronDown
                                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                                    menuOpen ? "rotate-180" : ""
                                }`}
                            />
                        </Button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Usuario info (solo mobile) */}
                                <div className="md:hidden px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user?.name || "Usuario"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Opciones de navegación */}
                                <div className="py-1">
                                    <button
                                        onClick={() => handleNavigation("/")}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                            location.pathname === "/"
                                                ? "bg-green-50 text-green-700 font-medium"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Home className="h-4 w-4" />
                                        <span>Inicio</span>
                                    </button>

                                    {user?.role === "admin" && (
                                        <button
                                            onClick={() => handleNavigation("/users")}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                location.pathname === "/users"
                                                    ? "bg-green-50 text-green-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>Gestión de Usuarios</span>
                                        </button>
                                    )}
                                </div>

                                {/* Separador */}
                                <div className="border-t border-gray-200 my-1"></div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}