"use client"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// URL del backend
const URI = process.env.API_URI;

function RegisterPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const router = useRouter();

    // Envio de la informacion al backend
    const onSubmit = handleSubmit(async (data) => {

        // Validamos que coincida el password
        if (data.password != data.confirmPassword) {
            return alert("Password don't match");
        }

        // Enviamos la peticion al backend
        const res = await fetch(URI + "/register", {
            method: "POST",
            body: JSON.stringify({
                name: data.username,
                correo: data.email,
                password: data.password
            }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        // Si pudimos ingresar los datos nos vamos al login
        if (res.ok) {
            router.push('/login');
        }
    });

    console.log(errors);

    return (
        <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
            <form onSubmit={onSubmit} className="w-1/4">
                <h1 className="text-slate-200 font-bold text-4xl mb-4">
                    Register form
                </h1>

                <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
                    Username:
                </label>
                <input type="text"
                    {...register("username", {
                        required: {
                            value: true,
                            message: "Username is required"
                        }
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="YourUsername"
                />
                {errors.username && (
                    <span className="text-red-500 text-xs">
                        {errors.username.message}
                    </span>
                )}

                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
                    Email:
                </label>
                <input type="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "Email is required"
                        }
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Your@email.com"
                />
                {errors.email && (
                    <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}

                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
                    Password:
                </label>
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
                    <span className="text-red-500 text-sm">
                        {errors.password.message}
                    </span>
                )}

                <label htmlFor="confirmedPassword" className="text-slate-500 mb-2 block text-sm">
                    Confirmed password:
                </label>
                <input type="password"
                    {...register("confirmPassword", {
                        required: {
                            value: true,
                            message: "Confirm password is required"
                        }
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="********"
                />
                {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </span>
                )}

                <button
                    className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;