import { useAuth } from "@/hooks/useAuth";
import { FileSpreadsheet, LogOut, User } from "lucide-react";
import { Button } from "./button";


export function Header(){
    const {user, logout} = useAuth()
        console.log(user)
    return(

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
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2  rounded-xl ">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            <span className="text-sm font-medium text-white">
                                {user?.name || user?.email || "Usuario"}
                            </span>
                        </div>
                        <Button
                            onClick={logout}
                            variant="outline"
                            size="sm"
                            className="text-sm cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 " />
                            <span className="hidden sm:inline ml-2">Cerrar sesión</span>
                        </Button>
                    </div>
                </div>
            </header>
    )
}