"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteAsientoContableAction } from "../actions";

interface DeleteAsientoContableButtonProps {
    asientoId: string;
    asientoNumero: number;
    redirectTo?: string;
    variant?: "icon" | "button";
    label?: string;
}

export function DeleteAsientoContableButton({
    asientoId,
    asientoNumero,
    redirectTo,
    variant = "icon",
    label = "Eliminar asiento",
}: DeleteAsientoContableButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteAsientoContableAction(asientoId);

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
            : "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60";

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={isPending}
                className={buttonClassName}
                title={label}
            >
                <Trash2 className="h-4 w-4" />
                {variant === "button" && <span>{label}</span>}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Eliminar asiento contable
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Esta acción eliminará el asiento del sistema.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Cerrar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 px-5 py-4">
                            <p className="text-sm text-slate-600">
                                ¿Está seguro que desea eliminar el asiento
                                contable N°{" "}
                                <span className="font-semibold text-slate-900">
                                    {asientoNumero}
                                </span>
                                ?
                            </p>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                Si este asiento fue generado automáticamente por
                                una factura de compra o venta, la factura
                                relacionada quedará sin asiento contable y podrá
                                ser editada, eliminada o anulada según
                                corresponda.
                            </div>

                            <p className="text-sm text-slate-500">
                                Si luego guarda nuevamente la factura y la
                                empresa tiene activada la generación automática,
                                se creará un nuevo asiento contable.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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