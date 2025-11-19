import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from "../../contex/AuthContext.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Mail, Lock, User, Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
        <Card className="w-full max-w-[420px] mx-auto shadow-xl border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="space-y-3 pb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-center text-slate-900">
                    Crear cuenta nueva
                </CardTitle>
                <CardDescription className="text-center text-slate-600">
                    Completa el formulario para registrarte
                </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Server Error Alert */}
                    {serverError && formState === 'error' && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-900">Error al crear cuenta</p>
                                    <p className="text-sm text-red-700 mt-1">{serverError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="name" 
                            className="text-sm font-medium text-slate-700"
                        >
                            Nombre completo
                        </Label>
                        <div className="relative">
                            <User className={cn(
                                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                                errors.name ? "text-red-500" : touchedFields.name && !errors.name ? "text-blue-500" : "text-slate-400"
                            )} />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Juan Pérez"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-11 h-11 transition-all duration-200",
                                    errors.name && "border-red-500 focus-visible:ring-red-500",
                                    touchedFields.name && !errors.name && nameValue && "border-blue-500 focus-visible:ring-blue-500"
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
                            className="text-sm font-medium text-slate-700"
                        >
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className={cn(
                                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                                errors.email ? "text-red-500" : touchedFields.email && !errors.email ? "text-blue-500" : "text-slate-400"
                            )} />
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-11 h-11 transition-all duration-200",
                                    errors.email && "border-red-500 focus-visible:ring-red-500",
                                    touchedFields.email && !errors.email && emailValue && "border-blue-500 focus-visible:ring-blue-500"
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
                            className="text-sm font-medium text-slate-700"
                        >
                            Contraseña
                        </Label>
                        <div className="relative">
                            <Lock className={cn(
                                "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200",
                                errors.password ? "text-red-500" : touchedFields.password && !errors.password ? "text-blue-500" : "text-slate-400"
                            )} />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={formState === 'submitting'}
                                className={cn(
                                    "pl-11 pr-11 h-11 transition-all duration-200",
                                    errors.password && "border-red-500 focus-visible:ring-red-500",
                                    touchedFields.password && !errors.password && passwordValue && "border-blue-500 focus-visible:ring-blue-500"
                                )}
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
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
                        className="w-full h-11 text-base font-semibold mt-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={formState === 'submitting' || !isValid}
                    >
                        {formState === 'submitting' ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Crear cuenta
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}