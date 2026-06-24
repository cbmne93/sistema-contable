"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Power, PowerOff, X } from "lucide-react";
import { toast } from "sonner";

import { toggleCuentaContableEstadoAction } from "../actions";

interface ToggleCuentaContableEstadoButtonProps {
    cuentaId: string;
    cuentaNombre: string;
    cuentaCodigo: string;
    estado: string;
}

export function ToggleCuentaContableEstadoButton({
    cuentaId,
    cuentaNombre,
    cuentaCodigo,
    estado,
}: ToggleCuentaContableEstadoButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const estaActiva = estado === "ACTIVO";

    const handleToggleEstado = () => {
        startTransition(async () => {
            const response = await toggleCuentaContableEstadoAction(cuentaId);

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
                className={
                    estaActiva
                        ? "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 text-amber-600 transition hover:bg-amber-50"
                        : "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50"
                }
                title={estaActiva ? "Desactivar cuenta" : "Activar cuenta"}
            >
                {estaActiva ? (
                    <PowerOff className="h-4 w-4" />
                ) : (
                    <Power className="h-4 w-4" />
                )}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div
                                    className={
                                        estaActiva
                                            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600"
                                            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                                    }
                                >
                                    <AlertTriangle className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        {estaActiva
                                            ? "Desactivar cuenta contable"
                                            : "Activar cuenta contable"}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {estaActiva
                                            ? "La cuenta dejará de estar disponible para nuevos registros."
                                            : "La cuenta volverá a estar disponible para nuevos registros."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-60"
                                title="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4">
                            <p className="text-sm text-slate-600">
                                ¿Seguro que desea{" "}
                                {estaActiva ? "desactivar" : "activar"} la
                                cuenta{" "}
                                <span className="font-semibold text-slate-900">
                                    {cuentaCodigo} - {cuentaNombre}
                                </span>
                                ?
                            </p>

                            {estaActiva && (
                                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                    No se podrá desactivar si tiene subcuentas
                                    activas.
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            {estaActiva ? (
                                <button
                                    type="button"
                                    onClick={handleToggleEstado}
                                    disabled={isPending}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <PowerOff className="h-4 w-4" />
                                    {isPending
                                        ? "Desactivando..."
                                        : "Desactivar"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleToggleEstado}
                                    disabled={isPending}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Power className="h-4 w-4" />
                                    {isPending ? "Activando..." : "Activar"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}