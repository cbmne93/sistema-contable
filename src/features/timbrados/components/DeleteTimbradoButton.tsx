"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertTriangle, Ban, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteTimbradoAction } from "../actions";

interface DeleteTimbradoButtonProps {
    timbradoId: string;
    tieneMovimientos?: boolean;
    estado?: "ACTIVO" | "INACTIVO";
}

export function DeleteTimbradoButton({
    timbradoId,
    tieneMovimientos = false,
    estado = "ACTIVO",
}: DeleteTimbradoButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const estaInactivo = estado === "INACTIVO";
    const accion = tieneMovimientos ? "desactivar" : "eliminar";
    const titulo = tieneMovimientos ? "Desactivar timbrado" : "Eliminar timbrado";
    const botonConfirmar = tieneMovimientos
        ? "Sí, desactivar"
        : "Sí, eliminar";

    const handleAction = () => {
        if (isPending || estaInactivo) {
            return;
        }

        startTransition(async () => {
            const result = await deleteTimbradoAction(timbradoId);

            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setOpen(false);
            router.refresh();
        });
    };

    if (estaInactivo) {
        return (
            <button
                type="button"
                disabled
                title="Timbrado desactivado"
                aria-label="Timbrado desactivado"
                className="inline-flex h-9 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400"
            >
                <Ban className="h-4 w-4" />
            </button>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={isPending}
                title={titulo}
                aria-label={titulo}
                className={
                    tieneMovimientos
                        ? "inline-flex h-9 w-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 shadow-sm transition hover:bg-amber-100 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                        : "inline-flex h-9 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 shadow-sm transition hover:bg-red-100 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                }
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : tieneMovimientos ? (
                    <Ban className="h-4 w-4" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
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
                                        {titulo}
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        {tieneMovimientos
                                            ? "No se eliminará de la base de datos."
                                            : "Esta acción no se puede deshacer."}
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
                                ¿Seguro que desea {accion} este timbrado?
                            </p>

                            {tieneMovimientos ? (
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Este timbrado ya tiene comprobantes asociados.
                                    Por ese motivo no se eliminará, solo quedará
                                    marcado como inactivo.
                                </p>
                            ) : (
                                <p className="mt-3 text-sm leading-6 font-medium text-red-600">
                                    Este timbrado no tiene comprobantes asociados,
                                    por eso se eliminará definitivamente.
                                </p>
                            )}
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
                                onClick={handleAction}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                {isPending ? "Procesando..." : botonConfirmar}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}