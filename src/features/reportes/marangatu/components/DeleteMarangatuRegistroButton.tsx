"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteMarangatuRegistroAction } from "../actions";

interface DeleteMarangatuRegistroButtonProps {
    id: string;
    codigo: string;
}

export function DeleteMarangatuRegistroButton({
    id,
    codigo,
}: DeleteMarangatuRegistroButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteMarangatuRegistroAction(id);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setOpen(false);
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <h3 className="text-base font-semibold text-slate-900">
                            Eliminar registro anulado
                        </h3>

                        <p className="mt-2 text-sm text-slate-600">
                            Se eliminará el registro{" "}
                            <span className="font-semibold text-slate-900">
                                {codigo}
                            </span>
                            . Esta acción también eliminará sus líneas generadas.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
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