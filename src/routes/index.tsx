import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ImportPage from "@/pages/ImportPage";
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    user ? <Navigate to="/" replace /> : <LoginPage />
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ImportPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* <Route>
                path="/user_management"
                element = {
                        
                }
            </Route> */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
