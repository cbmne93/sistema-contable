"use client";

import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { setEmpresaActivaAction } from "../actions";

interface AutoSeleccionarEmpresaProps {
    empresaId: string;
}

export function AutoSeleccionarEmpresa({
    empresaId,
}: AutoSeleccionarEmpresaProps) {
    const router = useRouter();
    const yaEjecutadoRef = useRef(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (yaEjecutadoRef.current) return;

        yaEjecutadoRef.current = true;

        startTransition(async () => {
            const response = await setEmpresaActivaAction(empresaId);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        });
    }, [empresaId, router]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <Loader2 className="h-7 w-7 animate-spin text-slate-500" />

                <div className="text-center">
                    <p className="font-medium text-slate-900">
                        Preparando empresa activa
                    </p>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Se encontró una sola empresa activa. Ingresando al
                        sistema...
                    </p>
                </div>

                {isPending && (
                    <p className="text-xs text-slate-400">
                        Configurando sesión...
                    </p>
                )}
            </div>
        </div>
    );
}