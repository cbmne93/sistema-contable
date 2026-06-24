"use client";

import { useState, useTransition } from "react";
import { Ban } from "lucide-react";
import { toast } from "sonner";

import { anularMarangatuRegistroAction } from "../actions";

interface AnularMarangatuRegistroButtonProps {
    id: string;
}

export function AnularMarangatuRegistroButton({
    id,
}: AnularMarangatuRegistroButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleAnular = () => {
        startTransition(async () => {
            const response = await anularMarangatuRegistroAction(id);

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
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
            >
                <Ban className="h-3.5 w-3.5" />
                Anular
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <h3 className="text-base font-semibold text-slate-900">
                            Anular registro
                        </h3>

                        <p className="mt-2 text-sm text-slate-600">
                            Esta acción marcará el registro como anulado. No se
                            eliminarán sus líneas generadas.
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
                                onClick={handleAnular}
                                disabled={isPending}
                                className="inline-flex h-9 items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
                            >
                                {isPending ? "Anulando..." : "Anular"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}