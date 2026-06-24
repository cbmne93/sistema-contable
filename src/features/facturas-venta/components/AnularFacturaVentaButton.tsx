"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertTriangle, Ban, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { anularFacturaVentaAction } from "@/features/facturas-venta/actions";

interface AnularFacturaVentaButtonProps {
    facturaId: string;
    disabled?: boolean;
    compact?: boolean;
}

export function AnularFacturaVentaButton({
    facturaId,
    disabled = false,
    compact = false,
}: AnularFacturaVentaButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleAnular = () => {
        startTransition(async () => {
            const response = await anularFacturaVentaAction(facturaId);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message || "Factura anulada correctamente.");

            setOpen(false);
            router.refresh();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={disabled || isPending}
                title="Anular factura"
                aria-label="Anular factura"
                className={
                    compact
                        ? "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        : "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                }
            >
                <Ban className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                {!compact && "Anular"}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 whitespace-normal">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Anular factura
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Esta acción cambiará el estado del
                                        comprobante.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <p className="text-sm leading-6 text-slate-600">
                                ¿Seguro que querés anular esta factura? Esta
                                acción no modifica los importes, solo cambia el
                                estado a{" "}
                                <span className="font-semibold text-red-700">
                                    ANULADO
                                </span>
                                .
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleAnular}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                {isPending ? "Anulando..." : "Sí, anular"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}