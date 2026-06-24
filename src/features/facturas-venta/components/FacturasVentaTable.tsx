import Link from "next/link";
import { BookOpen, Eye, FileText, Pencil } from "lucide-react";

import type { FacturaVenta } from "../interfaces";
import { AnularFacturaVentaButton } from "./AnularFacturaVentaButton";

type FacturasVentaSort = "createdAt" | "factura" | "fecha";
type SortOrder = "asc" | "desc";

interface FacturasVentaTableProps {
    facturas: FacturaVenta[];
    search?: string;
    sort?: FacturasVentaSort;
    order?: SortOrder;
}

function formatFecha(fecha: Date | string | null) {
    if (!fecha) {
        return "-";
    }

    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(fecha));
}

function formatCurrency(value: unknown, moneda: string) {
    const numberValue = Number(value ?? 0);

    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: moneda,
        maximumFractionDigits: moneda === "PYG" ? 0 : 2,
    }).format(numberValue);
}

function formatNumeroFactura(factura: FacturaVenta) {
    const establecimiento = factura.establecimiento ?? "---";
    const puntoExpedicion = factura.puntoExpedicion ?? "---";

    return `${establecimiento}-${puntoExpedicion}-${factura.numeroComprobante}`;
}

function formatDocumento(factura: FacturaVenta) {
    if (!factura.cliente?.numeroDocumento) {
        return "Sin documento";
    }

    return `${factura.cliente.numeroDocumento}${factura.cliente.dv ? `-${factura.cliente.dv}` : ""
        }`;
}

function getEstadoLabel(estado: string) {
    const labels: Record<string, string> = {
        BORRADOR: "Borrador",
        EMITIDO: "Emitido",
        ANULADO: "Anulado",
    };

    return labels[estado] ?? estado;
}

function getEstadoClassName(estado: string) {
    if (estado === "EMITIDO") {
        return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700";
    }

    if (estado === "ANULADO") {
        return "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700";
    }

    return "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700";
}

function getEstadoDotClassName(estado: string) {
    if (estado === "EMITIDO") {
        return "mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500";
    }

    if (estado === "ANULADO") {
        return "mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500";
    }

    return "mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500";
}

function actionButtonClassName() {
    return "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900";
}

function asientoButtonClassName() {
    return "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm transition hover:bg-indigo-100 hover:text-indigo-900";
}

function buildSortHref({
    field,
    currentSort,
    currentOrder,
    search,
}: {
    field: FacturasVentaSort;
    currentSort: FacturasVentaSort;
    currentOrder: SortOrder;
    search?: string;
}) {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    params.set("sort", field);

    if (currentSort === field) {
        params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
        params.set("order", field === "factura" ? "asc" : "desc");
    }

    return `/facturas-venta?${params.toString()}`;
}

function getSortIcon({
    field,
    currentSort,
    currentOrder,
}: {
    field: FacturasVentaSort;
    currentSort: FacturasVentaSort;
    currentOrder: SortOrder;
}) {
    if (field !== currentSort) {
        return "↕";
    }

    return currentOrder === "asc" ? "↑" : "↓";
}

export function FacturasVentaTable({
    facturas,
    search = "",
    sort = "createdAt",
    order = "desc",
}: FacturasVentaTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <Link
                                    href={buildSortHref({
                                        field: "factura",
                                        currentSort: sort,
                                        currentOrder: order,
                                        search,
                                    })}
                                    className="inline-flex items-center gap-1 transition hover:text-slate-900"
                                >
                                    Factura
                                    <span className="text-[10px]">
                                        {getSortIcon({
                                            field: "factura",
                                            currentSort: sort,
                                            currentOrder: order,
                                        })}
                                    </span>
                                </Link>
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Cliente
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Sucursal
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <Link
                                    href={buildSortHref({
                                        field: "fecha",
                                        currentSort: sort,
                                        currentOrder: order,
                                        search,
                                    })}
                                    className="inline-flex items-center gap-1 transition hover:text-slate-900"
                                >
                                    Fecha
                                    <span className="text-[10px]">
                                        {getSortIcon({
                                            field: "fecha",
                                            currentSort: sort,
                                            currentOrder: order,
                                        })}
                                    </span>
                                </Link>
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Condición
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Estado
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {facturas.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-700">
                                            No hay facturas registradas
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Cargue una nueva factura de venta
                                            para comenzar.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            facturas.map((factura) => {
                                const isAnulada = factura.estado === "ANULADO";
                                const tieneAsiento = Boolean(factura.asiento);

                                return (
                                    <tr
                                        key={factura.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <FileText className="h-4 w-4 text-slate-500" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="whitespace-nowrap font-medium text-slate-900">
                                                        {formatNumeroFactura(
                                                            factura
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                        Timb.{" "}
                                                        {factura.numeroTimbrado ??
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-700">
                                                    {factura.cliente?.nombre ??
                                                        "-"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {formatDocumento(factura)}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {factura.sucursal?.nombre ?? "-"}
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {formatFecha(factura.fechaEmision)}
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {factura.condicion === "CONTADO"
                                                ? "Contado"
                                                : "Crédito"}
                                        </td>

                                        <td className="px-3 py-3 text-right font-semibold text-slate-900">
                                            {formatCurrency(
                                                factura.total,
                                                factura.moneda
                                            )}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span
                                                className={getEstadoClassName(
                                                    factura.estado
                                                )}
                                            >
                                                <span
                                                    className={getEstadoDotClassName(
                                                        factura.estado
                                                    )}
                                                />
                                                {getEstadoLabel(factura.estado)}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="flex justify-end gap-1.5 whitespace-nowrap">
                                                {factura.asiento && (
                                                    <Link
                                                        href={`/asientos-contables/${factura.asiento.id}`}
                                                        title={`Ver asiento N° ${factura.asiento.numero}`}
                                                        aria-label={`Ver asiento N° ${factura.asiento.numero}`}
                                                        className={asientoButtonClassName()}
                                                    >
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/facturas-venta/${factura.id}`}
                                                    title="Ver factura"
                                                    aria-label="Ver factura"
                                                    className={actionButtonClassName()}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Link>

                                                {!isAnulada &&
                                                    !tieneAsiento && (
                                                        <>
                                                            <Link
                                                                href={`/facturas-venta/${factura.id}/editar`}
                                                                title="Editar factura"
                                                                aria-label="Editar factura"
                                                                className={actionButtonClassName()}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Link>

                                                            <AnularFacturaVentaButton
                                                                facturaId={
                                                                    factura.id
                                                                }
                                                                compact
                                                            />
                                                        </>
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