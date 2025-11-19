import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useAuth} from "../../contex/AuthContext.tsx";

const schema = z.object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
    const { register: registerUser } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const onSubmit = (data: FormData) => registerUser(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>

            <label className="block mb-2">Nombre</label>
            <input {...register('name')} className="w-full border px-3 py-2 rounded" />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

            <label className="block mt-4 mb-2">Email</label>
            <input {...register('email')} type="email" className="w-full border px-3 py-2 rounded" />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

            <label className="block mt-4 mb-2">Contraseña</label>
            <input {...register('password')} type="password" className="w-full border px-3 py-2 rounded" />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Registrarse
            </button>
        </form>
    )
}