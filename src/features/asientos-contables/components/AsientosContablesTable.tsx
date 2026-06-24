import Link from "next/link";
import { Edit, Eye, FileText } from "lucide-react";

import type { AsientoContable } from "../interfaces";

import { DeleteAsientoContableButton } from "./DeleteAsientoContableButton";

interface AsientosContablesTableProps {
    asientos: AsientoContable[];
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

function getOrigenLabel(origen: string) {
    const labels: Record<string, string> = {
        MANUAL: "Manual",
        VENTA: "Venta",
        COMPRA: "Compra",
        AJUSTE: "Ajuste",
        APERTURA: "Apertura",
        CIERRE: "Cierre",
    };

    return labels[origen] ?? origen;
}

function formatComprobante(asiento: AsientoContable) {
    if (!asiento.comprobante) {
        return "-";
    }

    const establecimiento = asiento.comprobante.establecimiento ?? "000";
    const puntoExpedicion = asiento.comprobante.puntoExpedicion ?? "000";

    return `${establecimiento}-${puntoExpedicion}-${asiento.comprobante.numeroComprobante}`;
}

function isAsientoManualEditable(asiento: AsientoContable) {
    return asiento.origen === "MANUAL" && !asiento.comprobante;
}

function isAsientoEliminable(asiento: AsientoContable) {
    if (asiento.estado === "ANULADO") {
        return false;
    }

    if (asiento.origen === "MANUAL" && !asiento.comprobante) {
        return true;
    }

    return (
        (asiento.origen === "COMPRA" || asiento.origen === "VENTA") &&
        Boolean(asiento.comprobante)
    );
}

export function AsientosContablesTable({
    asientos,
}: AsientosContablesTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="w-16 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nro.
                            </th>

                            <th className="w-30 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Fecha
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Concepto
                            </th>

                            <th className="w-24 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Origen
                            </th>

                            <th className="w-44 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Comprobante
                            </th>

                            <th className="w-36 px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {asientos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-700">
                                            No hay asientos contables registrados
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Cree un asiento manual para comenzar.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            asientos.map((asiento) => {
                                const puedeEditar =
                                    isAsientoManualEditable(asiento);
                                const puedeEliminar =
                                    isAsientoEliminable(asiento);

                                return (
                                    <tr
                                        key={asiento.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-3 py-3 text-center">
                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                {asiento.numero}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {formatDate(asiento.fecha)}
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="min-w-0">
                                                <p
                                                    className="truncate font-medium text-slate-900"
                                                    title={asiento.concepto}
                                                >
                                                    {asiento.concepto}
                                                </p>

                                                {asiento.sucursal && (
                                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                                        {
                                                            asiento.sucursal
                                                                .nombre
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {getOrigenLabel(asiento.origen)}
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            <span
                                                className="block truncate"
                                                title={formatComprobante(
                                                    asiento
                                                )}
                                            >
                                                {formatComprobante(asiento)}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/asientos-contables/${asiento.id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                                    title="Ver detalle"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                {puedeEditar && (
                                                    <Link
                                                        href={`/asientos-contables/${asiento.id}/editar`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                                        title="Editar asiento"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                )}

                                                {puedeEliminar && (
                                                    <DeleteAsientoContableButton
                                                        asientoId={asiento.id}
                                                        asientoNumero={
                                                            asiento.numero
                                                        }
                                                    />
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
    );
}