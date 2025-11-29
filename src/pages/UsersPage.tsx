import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import UserDeleteDialog from "@/components/users/UserDeleteDialog";
import { getUsers, createUser, updateUser, deleteUser } from "@/services/users";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser, CreateUserRequest, UpdateUserRequest } from "@/types/user";

type AlertType = "success" | "error" | null;

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para modal de creación
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createFormKey, setCreateFormKey] = useState(0); // Key para resetear formulario

    // Estados para modal de edición
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormKey, setEditFormKey] = useState(0); // Key para resetear formulario

    // Estados para diálogo de eliminación
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AuthUser | null>(null);

    // Estados para alertas
    const [alertType, setAlertType] = useState<AlertType>(null);
    const [alertMessage, setAlertMessage] = useState("");

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUsers();
            setUsers(response.users);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(
                error.response?.data?.message ||
                    "Error al cargar los usuarios. Por favor, intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type: "success" | "error", message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setTimeout(() => {
            setAlertType(null);
            setAlertMessage("");
        }, 5000);
    };

    // Función para crear usuario
    const handleCreateUser = async (data: CreateUserRequest | UpdateUserRequest) => {
        setIsCreating(true);
        try {
            const newUser = await createUser(data as CreateUserRequest);
            setUsers((prev) => [...prev, newUser]);
            setCreateModalOpen(false);
            setCreateFormKey(prev => prev + 1); // Resetear formulario después de éxito
            showAlert("success", `Usuario "${newUser.name}" creado exitosamente`);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            showAlert(
                "error",
                error.response?.data?.message ||
                    "Error al crear el usuario. Por favor, intenta nuevamente."
            );
        } finally {
            setIsCreating(false);
        }
    };

    // Función para editar usuario
    const handleEditUser = async (data: CreateUserRequest | UpdateUserRequest) => {
        if (!selectedUser) return;

        // Validar que admin no se quite su propio rol
        if (
            selectedUser.id === currentUser?.id &&
            selectedUser.role === "admin" &&
            data.role === "user"
        ) {
            showAlert(
                "error",
                "No puedes quitarte el rol de administrador a ti mismo"
            );
            return;
        }

        setIsEditing(true);
        try {
            const updatedUser = await updateUser(
                selectedUser.id,
                data as UpdateUserRequest
            );
            setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setEditModalOpen(false);
            setSelectedUser(null);
            setEditFormKey(prev => prev + 1); // Resetear formulario después de éxito
            showAlert("success", `Usuario "${updatedUser.name}" actualizado exitosamente`);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            showAlert(
                "error",
                error.response?.data?.message ||
                    "Error al actualizar el usuario. Por favor, intenta nuevamente."
            );
        } finally {
            setIsEditing(false);
        }
    };

    // Función para eliminar usuario
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            showAlert("success", `Usuario "${userToDelete.name}" eliminado exitosamente`);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            showAlert(
                "error",
                error.response?.data?.message ||
                    "Error al eliminar el usuario. Por favor, intenta nuevamente."
            );
        }
    };

    // Handlers para abrir modales
    const openCreateModal = () => {
        setCreateModalOpen(true);
    };

    const openEditModal = (user: AuthUser) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const openDeleteDialog = (user: AuthUser) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-sm text-gray-600">
                            Administra los usuarios del sistema y sus permisos
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Crear Usuario
                    </Button>
                </div>
            </div>

            {/* Alertas */}
            {alertType && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Alert
                        className={
                            alertType === "success"
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                        }
                    >
                        <div className="flex items-start gap-3">
                            {alertType === "success" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            )}
                            <AlertDescription
                                className={
                                    alertType === "success"
                                        ? "text-green-800"
                                        : "text-red-800"
                                }
                            >
                                {alertMessage}
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Contenido principal */}
            <Card className="shadow-lg border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <CardTitle className="text-xl text-gray-900">Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                            <p className="text-sm text-gray-600">Cargando usuarios...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Error al cargar usuarios
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 max-w-md">{error}</p>
                            <Button onClick={loadUsers} variant="outline">
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <UserTable
                            users={users}
                            onEdit={openEditModal}
                            onDelete={openDeleteDialog}
                            currentUserId={currentUser?.id || ""}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modal de Creación */}
            <AlertDialog 
                open={createModalOpen} 
                onOpenChange={(open) => {
                    if (!open && !isCreating) {
                        // Solo cerrar si no está guardando
                        setCreateModalOpen(false);
                    }
                }}
            >
                <AlertDialogContent className="sm:max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Crear Nuevo Usuario
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <UserForm
                        key={createFormKey}
                        mode="create"
                        onSubmit={handleCreateUser}
                        onCancel={() => {
                            setCreateModalOpen(false);
                            setCreateFormKey(prev => prev + 1); // Resetear al cancelar
                        }}
                        isSubmitting={isCreating}
                    />
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de Edición */}
            <AlertDialog 
                open={editModalOpen} 
                onOpenChange={(open) => {
                    if (!open && !isEditing) {
                        // Solo cerrar si no está guardando
                        setEditModalOpen(false);
                        setSelectedUser(null);
                    }
                }}
            >
                <AlertDialogContent className="sm:max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">
                            Editar Usuario
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    {selectedUser && (
                        <UserForm
                            key={`${editFormKey}-${selectedUser.id}`}
                            mode="edit"
                            user={selectedUser}
                            onSubmit={handleEditUser}
                            onCancel={() => {
                                setEditModalOpen(false);
                                setSelectedUser(null);
                                setEditFormKey(prev => prev + 1); // Resetear al cancelar
                            }}
                            isSubmitting={isEditing}
                        />
                    )}
                </AlertDialogContent>
            </AlertDialog>

            {/* Diálogo de Eliminación */}
            <UserDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={userToDelete}
                onConfirm={handleDeleteUser}
                currentUserId={currentUser?.id || ""}
            />
        </div>
    );
}
