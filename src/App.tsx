import './App.css'
import ImportExcel from "./components/Import/ImportExcel.tsx";
import {useAuth} from "./contex/AuthContext.tsx";
import {useState} from "react";
import LoginForm from "./components/User/LoginForm.tsx";
import RegisterForm from "./components/User/RegisterForm.tsx";

function App() {
    const {user, logout} = useAuth();
    const [showRegister, setShowRegister] = useState(false);
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-full max-w-md">
                    {showRegister ? <RegisterForm/> : <LoginForm/>}
                    <button
                        onClick={() => setShowRegister((s: boolean) => !s)}
                        className="mt-4 text-blue-600 underline"
                    >
                        {showRegister ? '¿Ya tienes cuenta? Inicia sesión' : 'Crear cuenta'}
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Importar Excel</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <button onClick={logout} className="btn btn-sm">
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="p-6">
                <ImportExcel/>
            </main>
        </div>
    )
}

export default App
