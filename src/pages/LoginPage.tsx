import LoginForm from "@/components/user/LoginForm";


export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="w-full max-w-md space-y-6">
                <LoginForm />
            </div>
        </div>
    );
}
