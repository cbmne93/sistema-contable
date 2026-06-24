import Link from "next/link";
import { CalendarDays, CheckCircle2, Plus } from "lucide-react";

import {
    getPeriodosFiscalesAction,
    setPeriodoFiscalActivoAction,
} from "@/features/periodos-fiscales/actions";

function formatDate(date: Date | string | null) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}

function getEstadoClassName(estado: string) {
    if (estado === "CERRADO") {
        return "inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700";
    }

    return "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700";
}

export default async function PeriodosFiscalesPage() {
    const { ok, message, periodosFiscales, periodoFiscalActivoId } =
        await getPeriodosFiscalesAction();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <CalendarDays className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Periodos fiscales
                        </h1>

                        <p className="text-sm text-slate-500">
                            Administre los años fiscales de la empresa activa.
                        </p>
                    </div>
                </div>

                <Link
                    href="/periodos-fiscales/nuevo"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo periodo
                </Link>
            </div>

            {!ok && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {message}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <p className="text-sm text-slate-500">
                        {periodosFiscales.length}{" "}
                        {periodosFiscales.length === 1
                            ? "periodo fiscal registrado"
                            : "periodos fiscales registrados"}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-190 text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Periodo
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Desde
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Hasta
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {periodosFiscales.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-sm text-slate-500"
                                    >
                                        No hay periodos fiscales registrados.
                                    </td>
                                </tr>
                            ) : (
                                periodosFiscales.map((periodo) => {
                                    const isActivo =
                                        periodo.id === periodoFiscalActivoId;

                                    return (
                                        <tr
                                            key={periodo.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-slate-900">
                                                            {periodo.descripcion}
                                                        </p>

                                                        {isActivo && (
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Activo
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        Año {periodo.anio}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-slate-700">
                                                {formatDate(
                                                    periodo.fechaInicio
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-slate-700">
                                                {formatDate(periodo.fechaFin)}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={getEstadoClassName(
                                                        periodo.estado
                                                    )}
                                                >
                                                    {periodo.estado}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-end">
                                                    {isActivo ? (
                                                        <span className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-3 text-sm font-medium text-slate-400">
                                                            Seleccionado
                                                        </span>
                                                    ) : (
                                                        <form
                                                            action={
                                                                setPeriodoFiscalActivoAction
                                                            }
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name="periodoFiscalId"
                                                                value={
                                                                    periodo.id
                                                                }
                                                            />

                                                            <button
                                                                type="submit"
                                                                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                                            >
                                                                Usar periodo
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}