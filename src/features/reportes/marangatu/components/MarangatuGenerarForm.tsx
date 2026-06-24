"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

import { generarMarangatuRegistroAction } from "../actions";

const MONTH_OPTIONS = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
];

export function MarangatuGenerarForm() {
    const router = useRouter();

    const [tipoInforme, setTipoInforme] = useState<
        "TODOS" | "COMPRAS" | "VENTAS"
    >("TODOS");
    const [mes, setMes] = useState(String(new Date().getMonth() + 1));
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
        startTransition(async () => {
            const response = await generarMarangatuRegistroAction({
                tipoInforme,
                mes: Number(mes),
            });

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            router.refresh();
        });
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Generar registro
                </h2>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-[240px_180px_auto] md:items-end">
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tipo de informe
                    </label>

                    <select
                        value={tipoInforme}
                        onChange={(event) =>
                            setTipoInforme(
                                event.target.value as
                                | "TODOS"
                                | "COMPRAS"
                                | "VENTAS"
                            )
                        }
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="TODOS">Todos</option>
                        <option value="COMPRAS">Compras</option>
                        <option value="VENTAS">Ventas</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mes
                    </label>

                    <select
                        value={mes}
                        onChange={(event) => setMes(event.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                        {MONTH_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FilePlus2 className="h-4 w-4" />
                    {isPending ? "Generando..." : "Generar información"}
                </button>
            </div>
        </section>
    );
}