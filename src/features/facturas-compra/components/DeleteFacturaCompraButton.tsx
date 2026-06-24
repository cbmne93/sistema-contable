"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteFacturaCompraAction } from "../actions";

interface DeleteFacturaCompraButtonProps {
    facturaId: string;
    numeroFactura: string;
    redirectTo?: string;
    variant?: "icon" | "button";
    label?: string;
}

export function DeleteFacturaCompraButton({
    facturaId,
    numeroFactura,
    redirectTo,
    variant = "icon",
    label = "Eliminar factura",
}: DeleteFacturaCompraButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteFacturaCompraAction(facturaId);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setOpen(false);

            if (redirectTo) {
                router.push(redirectTo);
            }

            router.refresh();
        });
    };

    const buttonClassName =
        variant === "button"
            ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            : "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60";

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={isPending}
                title={label}
                aria-label={label}
                className={buttonClassName}
            >
                <Trash2 className={variant === "button" ? "h-4 w-4" : "h-3.5 w-3.5"} />
                {variant === "button" && <span>{label}</span>}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl whitespace-normal">
                        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Eliminar factura de compra
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Cerrar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 px-5 py-4">
                            <p className="text-sm leading-5 text-slate-700">
                                ¿Desea eliminar esta factura de compra?
                            </p>

                            <p className="text-sm font-semibold text-slate-900">
                                {numeroFactura}
                            </p>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-800">
                                <p className="font-semibold">Importante</p>

                                <p className="mt-1">
                                    Si la factura tiene un asiento contable generado, primero debe
                                    eliminar el asiento relacionado.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
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
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}