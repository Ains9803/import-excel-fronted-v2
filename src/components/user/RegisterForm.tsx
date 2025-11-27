import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Mail, Lock, User, Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from '@/hooks/useAuth'

// Schema de validación con mensajes específicos
const schema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    email: z
        .string()
        .min(1, 'El email es requerido')
        .email('Por favor ingresa un email válido'),
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres'),
})

type FormData = z.infer<typeof schema>

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function RegisterForm() {
    const { register: registerUser } = useAuth()
    const [formState, setFormState] = useState<FormState>('idle')
    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string>('')
    
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, touchedFields },
        watch,
    } = useForm<FormData>({ 
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: FormData) => {
        setFormState('submitting')
        setServerError('')
        
        try {
            await registerUser(data)
            setFormState('success')
        } catch (error) {
            setFormState('error')
            const err = error as { response?: { data?: { message?: string } } }
            setServerError(err.response?.data?.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.')
        }
    }

    const nameValue = watch('name')
    const emailValue = watch('email')
    const passwordValue = watch('password')

    return (
        <Card className="w-full max-w-[440px] mx-auto shadow-lg border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-white/95 backdrop-blur-sm">
            {/* Barra superior con gradiente Excel */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
            
            <CardHeader className="space-y-4 pb-6 pt-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mx-auto shadow-lg">
                    <UserPlus className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-center space-y-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                        Crear cuenta
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                        Completa el formulario para comenzar
                    </CardDescription>
                </div>
            </CardHeader>
            
            <CardContent className="pb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Server Error Alert */}
                    {serverError && formState === 'error' && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
                                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-red-900">Error al crear cuenta</p>
                                    <p className="text-sm text-red-700 mt-1">{serverError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="name" 
                            className="text-sm font-semibold text-gray-700"
                        >
                            Nombre completo
                        </Label>
                        <div className="relative group">
                            <User className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
                                errors.name ? "text-red-500" : touchedFields.name && !errors.name ? "text-green-500" : "text-gray-400 group-hover:text-green-500"
                            )} />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Juan Pérez"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-12 h-12 rounded-lg transition-all duration-200 border-2",
                                    errors.name && "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                                    touchedFields.name && !errors.name && nameValue && "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                                    !errors.name && !touchedFields.name && "border-gray-200 hover:border-green-300"
                                )}
                                aria-invalid={errors.name ? "true" : "false"}
                                aria-describedby={errors.name ? "name-error" : undefined}
                                {...register('name')}
                            />
                        </div>
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

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="email" 
                            className="text-sm font-semibold text-gray-700"
                        >
                            Correo electrónico
                        </Label>
                        <div className="relative group">
                            <Mail className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
                                errors.email ? "text-red-500" : touchedFields.email && !errors.email ? "text-green-500" : "text-gray-400 group-hover:text-green-500"
                            )} />
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-12 h-12 rounded-lg transition-all duration-200 border-2",
                                    errors.email && "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                                    touchedFields.email && !errors.email && emailValue && "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                                    !errors.email && !touchedFields.email && "border-gray-200 hover:border-green-300"
                                )}
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                {...register('email')}
                            />
                        </div>
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

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="password" 
                            className="text-sm font-semibold text-gray-700"
                        >
                            Contraseña
                        </Label>
                        <div className="relative group">
                            <Lock className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
                                errors.password ? "text-red-500" : touchedFields.password && !errors.password ? "text-green-500" : "text-gray-400 group-hover:text-green-500"
                            )} />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-12 pr-12 h-12 rounded-lg transition-all duration-200 border-2",
                                    errors.password && "border-red-300 focus-visible:ring-red-500 bg-red-50/50",
                                    touchedFields.password && !errors.password && passwordValue && "border-green-300 focus-visible:ring-green-500 bg-green-50/50",
                                    !errors.password && !touchedFields.password && "border-gray-200 hover:border-green-300"
                                )}
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register('password')}
                            />
                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 border-0 shadow-none"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
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

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        variant="primary"
                        size="lg"
                        className="w-full text-sm sm:text-base mt-6"
                        disabled={formState === 'submitting' || !isValid}
                    >
                        {formState === 'submitting' ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                Creando cuenta...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                                Crear cuenta
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}