"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Empresa } from "../interfaces";
import { setEmpresaActivaAction } from "../actions";

interface SeleccionarEmpresaFormProps {
    empresas: Empresa[];
}

export function SeleccionarEmpresaForm({
    empresas,
}: SeleccionarEmpresaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [empresaSeleccionadaId, setEmpresaSeleccionadaId] = useState<
        string | null
    >(null);

    const handleSelectEmpresa = (empresaId: string) => {
        setEmpresaSeleccionadaId(empresaId);

        startTransition(async () => {
            const response = await setEmpresaActivaAction(empresaId);

            if (!response.ok) {
                toast.error(response.message);
                setEmpresaSeleccionadaId(null);
                return;
            }

            toast.success("Empresa seleccionada correctamente.");

            router.push("/dashboard");
            router.refresh();
        });
    };

    return (
        <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Building2 className="h-7 w-7 text-slate-700" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Seleccionar empresa
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Elija la empresa con la que desea trabajar en esta sesión.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {empresas.map((empresa) => {
                    const estaSeleccionando =
                        isPending && empresaSeleccionadaId === empresa.id;

                    return (
                        <button
                            key={empresa.id}
                            type="button"
                            onClick={() => handleSelectEmpresa(empresa.id)}
                            disabled={isPending}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-slate-200">
                                    <Building2 className="h-6 w-6 text-slate-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-base font-semibold text-slate-900">
                                        {empresa.razonSocial}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        RUC: {empresa.ruc}-{empresa.dv}
                                    </p>

                                    {empresa.email && (
                                        <p className="mt-1 truncate text-sm text-slate-500">
                                            {empresa.email}
                                        </p>
                                    )}
                                </div>

                                {estaSeleccionando ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-slate-300 transition group-hover:text-emerald-500" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}