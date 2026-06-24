import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface CuentaContableActionsProps {
    isPending: boolean;
    submitLabel?: string;
    pendingLabel?: string;
}

export function CuentaContableActions({
    isPending,
    submitLabel = "Guardar cuenta",
    pendingLabel = "Guardando...",
}: CuentaContableActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
                href="/plan-cuentas"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </Link>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Save className="h-4 w-4" />
                {isPending ? pendingLabel : submitLabel}
            </button>
        </div>
    );
}