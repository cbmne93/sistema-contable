"use client";

import { useRouter } from "next/navigation";

interface FacturaCompraActionsProps {
    isPending: boolean;
    submitLabel?: string;
}

export function FacturaCompraActions({
    isPending,
    submitLabel = "Guardar factura",
}: FacturaCompraActionsProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-end gap-3">
            <button
                type="button"
                onClick={() => router.push("/facturas-compra")}
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Cancelar
            </button>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Guardando..." : submitLabel}
            </button>
        </div>
    );
}