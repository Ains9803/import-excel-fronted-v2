import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthUser, UserRole } from "@/types/user";

// Schema de validación para crear usuario
const createUserSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El email es requerido").email("Email inválido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["admin", "user"], {
        required_error: "El rol es requerido",
    }),
});

// Schema de validación para editar usuario (contraseña opcional)
const updateUserSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El email es requerido").email("Email inválido"),
    password: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 6,
            "La contraseña debe tener al menos 6 caracteres"
        ),
    role: z.enum(["admin", "user"], {
        required_error: "El rol es requerido",
    }),
});

type CreateFormData = z.infer<typeof createUserSchema>;
type UpdateFormData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
    mode: "create" | "edit";
    user?: AuthUser;
    onSubmit: (data: CreateFormData | UpdateFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function UserForm({
    mode,
    user,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: UserFormProps) {
    const schema = mode === "create" ? createUserSchema : updateUserSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
    } = useForm<CreateFormData | UpdateFormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues:
            mode === "edit" && user
                ? {
                      name: user.name,
                      email: user.email,
                      password: "",
                      role: user.role,
                  }
                : {
                      name: "",
                      email: "",
                      password: "",
                      role: "user" as UserRole,
                  },
    });

    // Pre-cargar datos si estamos en modo edición
    useEffect(() => {
        if (mode === "edit" && user) {
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("role", user.role);
        }
    }, [mode, user, setValue]);

    const nameValue = watch("name");
    const emailValue = watch("email");
    const passwordValue = watch("password");
    const roleValue = watch("role");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Nombre */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Nombre completo
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    disabled={isSubmitting}
                    className={cn(
                        "h-11 rounded-lg transition-all duration-200 border-2",
                        errors.name &&
                            "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                        touchedFields.name &&
                            !errors.name &&
                            nameValue &&
                            "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                        !errors.name &&
                            !touchedFields.name &&
                            "border-gray-200 hover:border-green-300"
                    )}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                />
                {errors.name && (
                    <p
                        id="name-error"
                        className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Correo electrónico
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    disabled={isSubmitting}
                    className={cn(
                        "h-11 rounded-lg transition-all duration-200 border-2",
                        errors.email &&
                            "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                        touchedFields.email &&
                            !errors.email &&
                            emailValue &&
                            "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                        !errors.email &&
                            !touchedFields.email &&
                            "border-gray-200 hover:border-green-300"
                    )}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                />
                {errors.email && (
                    <p
                        id="email-error"
                        className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
                <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                >
                    Contraseña {mode === "edit" && "(opcional)"}
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={
                        mode === "edit"
                            ? "Dejar en blanco para no cambiar"
                            : "Mínimo 6 caracteres"
                    }
                    disabled={isSubmitting}
                    className={cn(
                        "h-11 rounded-lg transition-all duration-200 border-2",
                        errors.password &&
                            "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                        touchedFields.password &&
                            !errors.password &&
                            passwordValue &&
                            "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                        !errors.password &&
                            !touchedFields.password &&
                            "border-gray-200 hover:border-green-300"
                    )}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
                />
                {errors.password && (
                    <p
                        id="password-error"
                        className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Campo Rol */}
            <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                    Rol
                </Label>
                <Select
                    value={roleValue}
                    onValueChange={(value) => setValue("role", value as UserRole)}
                    disabled={isSubmitting}
                >
                    <SelectTrigger
                        id="role"
                        className={cn(
                            "h-11 rounded-lg transition-all duration-200 border-2",
                            errors.role &&
                                "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                            !errors.role && "border-gray-200 hover:border-green-300"
                        )}
                        aria-invalid={errors.role ? "true" : "false"}
                        aria-describedby={errors.role ? "role-error" : undefined}
                    >
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">Usuario</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && (
                    <p
                        id="role-error"
                        className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.role.message}
                    </p>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
