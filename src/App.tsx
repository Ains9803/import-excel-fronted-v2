import "./App.css";
import AppRoutes from "./routes";

function App() {
<<<<<<< HEAD
    const { user, logout } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    // if (!user) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    //             {/* Background decorativo */}
    //             <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
    //             <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    //             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    //             <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

    //             <div className="w-full max-w-md space-y-6 relative z-10">
    //                 {showRegister ? <RegisterForm /> : <LoginForm />}
    //                 <div className="text-center">
    //                     <button
    //                         onClick={() => setShowRegister((s: boolean) => !s)}
    //                         className="relative inline-block text-sm font-medium cursor-pointer transition-all duration-200 group"
    //                     >
    //                         <span className="inline-block text-gray-700 group-hover:text-green-600 transition-colors duration-200">
    //                             {showRegister ? (
    //                                 <>¿Ya tienes cuenta? <span className="font-bold">Inicia sesión</span></>
    //                             ) : (
    //                                 <>¿No tienes cuenta? <span className="font-bold">Regístrate</span></>
    //                             )}
    //                         </span>
    //                         <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300 ease-out"></span>
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="min-h-screen">
            {/* Skip link for keyboard navigation */}
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            {/* Header con gradiente Excel */}
            <header className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center max-w-[1280px]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                            <FileSpreadsheet className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">Excel Importer</h1>
                            <p className="text-xs sm:text-sm text-green-50 hidden sm:block">Gestión de datos simplificada</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                            <User className="h-4 w-4 text-white" />
                            <span className="text-sm font-medium text-white">{user?.email || 'usuario@demo.com'}</span>
                        </div>
                        <Button
                            onClick={logout}
                            variant="outline"
                            size="default"
                            className="text-sm cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Cerrar sesión</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main id="main-content" className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-[1280px]">
                <ImportExcel />
            </main>
        </div>
    )
=======
    return <AppRoutes />;
>>>>>>> 03abdc39fe7fe9eb580ec6b8752fa4755626028c
}

export default App;
