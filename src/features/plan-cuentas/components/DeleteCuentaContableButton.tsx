"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { deleteCuentaContableAction } from "../actions";

interface DeleteCuentaContableButtonProps {
    cuentaId: string;
    cuentaNombre: string;
    cuentaCodigo: string;
}

export function DeleteCuentaContableButton({
    cuentaId,
    cuentaNombre,
    cuentaCodigo,
}: DeleteCuentaContableButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteCuentaContableAction(cuentaId);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setIsOpen(false);
            router.refresh();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                title="Eliminar cuenta"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Eliminar cuenta contable
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-60"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <p className="text-sm text-slate-600">
                                ¿Seguro que desea eliminar la cuenta{" "}
                                <span className="font-semibold text-slate-900">
                                    {cuentaCodigo} - {cuentaNombre}
                                </span>
                                ?
                            </p>

                            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                Solo se eliminará si no tiene subcuentas y no fue
                                utilizada en comprobantes o asientos contables.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isPending ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}