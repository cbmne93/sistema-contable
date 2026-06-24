"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { clearEmpresaActivaAction } from "../actions";

export function CambiarEmpresaButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleChangeEmpresa = () => {
        startTransition(async () => {
            const response = await clearEmpresaActivaAction();

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success("Seleccione la empresa con la que desea trabajar.");

            router.push("/seleccionar-empresa");
            router.refresh();
        });
    };

    return (
        <button
            type="button"
            onClick={handleChangeEmpresa}
            disabled={isPending}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <RefreshCw className="h-3.5 w-3.5" />
            {isPending ? "Cambiando..." : "Cambiar"}
        </button>
    );
}