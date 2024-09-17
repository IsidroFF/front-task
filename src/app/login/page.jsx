"use client"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const URI = process.env.API_URI || "NO existe un URI del backend"; // Asegúrate de tener una URL predeterminada para pruebas locales

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await fetch(`${URI}/api/auth/login`, {
                method: "POST",
                body: JSON.stringify({
                    correo: data.email,
                    password: data.password
                }),
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.status !== 200) {
                alert("Login failed");
                throw new Error('Login failed');
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    return (
        <div className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="w-1/4">
                <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">Email:</label>
                <input type="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "Email is required"
                        }
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Your@Email.com"
                />
                {errors.email && (
                    <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}

                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">Password:</label>
                <input type="password"
                    {...register("password", {
                        required: {
                            value: true,
                            message: "Password is required"
                        }
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="********"
                />
                {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}

                <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">Log in</button>
            </form>
            <div className="mt-4">
                <p className="text-slate-500">Dont have an account?</p>
                <a href="/register" className="text-blue-500">Register here</a>
            </div>
        </div>
    );
}

export default LoginPage;
