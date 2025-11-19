import './App.css'
import ImportExcel from "./components/Import/ImportExcel.tsx";
import {useAuth} from "./contex/AuthContext.tsx";
import {useState} from "react";
import LoginForm from "./components/User/LoginForm.tsx";
import RegisterForm from "./components/User/RegisterForm.tsx";
import {Button} from "./components/ui/button.tsx";
import {LogOut, User, FileSpreadsheet} from "lucide-react";

function App() {
    const {user, logout} = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-4">
                    {showRegister ? <RegisterForm/> : <LoginForm/>}
                    <div className="text-center">
                        <button
                            onClick={() => setShowRegister((s: boolean) => !s)}
                            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-all duration-200 hover:underline underline-offset-4 text-sm"
                        >
                            {showRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Skip link for keyboard navigation */}
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center max-w-[1280px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Importar Excel</h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                            <User className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">{user?.email || 'usuario@demo.com'}</span>
                        </div>
                        <Button 
                            onClick={logout} 
                            variant="outline" 
                            size="default" 
                            className="text-sm cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Cerrar sesión</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main id="main-content" className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-[1280px]">
                <ImportExcel/>
            </main>
        </div>
    )
}

export default App
