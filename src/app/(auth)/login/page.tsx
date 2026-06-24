"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Building2,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<LoginErrors>({});

    const validateForm = () => {
        const newErrors: LoginErrors = {};

        if (!email.trim()) {
            newErrors.email = "Ingrese el correo electrónico.";
        }

        if (!password.trim()) {
            newErrors.password = "Ingrese la contraseña.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            toast.error("Ingrese correo electrónico y contraseña.");
            return;
        }

        const emailValue = email.trim().toLowerCase();
        const passwordValue = password.trim();

        startTransition(async () => {
            const response = await signIn("credentials", {
                email: emailValue,
                password: passwordValue,
                redirect: false,
            });

            if (response?.error) {
                toast.error("Correo electrónico o contraseña incorrectos.");

                setErrors({
                    email: "Verifique el correo electrónico.",
                    password: "Verifique la contraseña.",
                });

                return;
            }

            toast.success("Inicio de sesión correcto.");
            router.push("/seleccionar-empresa");
            router.refresh();
        });
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);

        if (errors.email) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                email: undefined,
            }));
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);

        if (errors.password) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                password: undefined,
            }));
        }
    };

    const inputBaseClassName =
        "h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60";

    const inputNormalClassName =
        "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

    const inputErrorClassName =
        "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100";

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div
                className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                style={{ maxWidth: "420px" }}
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <Building2 className="h-7 w-7" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                        Sistema Contable
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Ingrese sus credenciales para continuar
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Acceso seguro
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                                <Mail className="h-3.5 w-3.5" />
                            </span>
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                handleEmailChange(event.target.value)
                            }
                            autoComplete="email"
                            placeholder="admin@sistema.com"
                            disabled={isPending}
                            className={`${inputBaseClassName} ${errors.email
                                ? inputErrorClassName
                                : inputNormalClassName
                                }`}
                        />

                        {errors.email && (
                            <p className="text-xs font-medium text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                                <LockKeyhole className="h-3.5 w-3.5" />
                            </span>
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                handlePasswordChange(event.target.value)
                            }
                            autoComplete="current-password"
                            placeholder="Ingrese su contraseña"
                            disabled={isPending}
                            className={`${inputBaseClassName} ${errors.password
                                ? inputErrorClassName
                                : inputNormalClassName
                                }`}
                        />

                        {errors.password && (
                            <p className="text-xs font-medium text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        {isPending ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Sistema privado. Acceso solo para usuarios autorizados.
                </p>
            </div>
        </main>
    );
}