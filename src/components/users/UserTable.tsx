import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, User as UserIcon, Mail, Search } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import type { AuthUser } from "@/types/user";

interface UserTableProps {
    users: AuthUser[];
    onEdit: (user: AuthUser) => void;
    onDelete: (user: AuthUser) => void;
    currentUserId: string;
}

export default function UserTable({
    users,
    onEdit,
    onDelete,
    currentUserId,
}: UserTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filtrar usuarios en tiempo real
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);
    // Formatear fecha a formato legible
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Truncar ID para mostrar solo los primeros caracteres
    const truncateId = (id: string) => {
        return id.length > 8 ? `${id.substring(0, 8)}...` : id;
    };

    const emptyState = (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No se encontraron resultados" : "No hay usuarios"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
                {searchQuery
                    ? `No se encontraron usuarios que coincidan con "${searchQuery}"`
                    : "No se encontraron usuarios registrados en el sistema."}
            </p>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 border-gray-300 focus-visible:ring-green-500"
                    />
                </div>
                {searchQuery && (
                    <div className="text-sm text-gray-600">
                        {filteredUsers.length} resultado{filteredUsers.length !== 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Tabla */}
            {filteredUsers.length === 0 ? (
                emptyState
            ) : (
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <Table>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100 border-b border-gray-200">
                        <TableHead className="font-semibold text-gray-700 py-4">ID</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">
                            Nombre
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">
                            Email
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Rol</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">
                            Fecha de Creación
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 text-right">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => {
                        const isCurrentUser = user.id === currentUserId;
                        return (
                            <TableRow
                                key={user.id}
                                className="hover:bg-green-50/30 transition-colors border-b border-gray-100 last:border-0"
                            >
                                <TableCell className="font-mono text-xs text-gray-500 py-4">
                                    <span
                                        title={user.id}
                                        className="cursor-help"
                                    >
                                        {truncateId(user.id)}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                                            <UserIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">
                                                {user.name}
                                            </span>
                                            {isCurrentUser && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    (Usuario actual)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <UserRoleBadge role={user.role} />
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 py-4">
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(user)}
                                            className="hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(user)}
                                            disabled={isCurrentUser}
                                            className={
                                                isCurrentUser
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                            }
                                            title={
                                                isCurrentUser
                                                    ? "No puedes eliminarte a ti mismo"
                                                    : "Eliminar usuario"
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
                </div>
            )}
        </div>
    );
}
