import Link from "next/link";
import {
    ArrowLeft,
    Edit,
    FileText,
    Layers3,
    ReceiptText,
} from "lucide-react";

import type { AsientoContableDetalle } from "../interfaces";

import { DeleteAsientoContableButton } from "./DeleteAsientoContableButton";

interface AsientoContableDetalleViewProps {
    asiento: AsientoContableDetalle;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value || 0);
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

function getEstadoLabel(estado: string) {
    const labels: Record<string, string> = {
        BORRADOR: "Borrador",
        CONFIRMADO: "Confirmado",
        ANULADO: "Anulado",
    };

    return labels[estado] ?? estado;
}

function getEstadoClassName(estado: string) {
    if (estado === "CONFIRMADO") {
        return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700";
    }

    if (estado === "ANULADO") {
        return "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700";
    }

    return "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700";
}

function formatComprobante(asiento: AsientoContableDetalle) {
    if (!asiento.comprobante) {
        return "Sin comprobante";
    }

    const establecimiento = asiento.comprobante.establecimiento ?? "000";
    const puntoExpedicion = asiento.comprobante.puntoExpedicion ?? "000";

    return `${establecimiento}-${puntoExpedicion}-${asiento.comprobante.numeroComprobante}`;
}

function getComprobanteHref(asiento: AsientoContableDetalle) {
    if (!asiento.comprobante) {
        return null;
    }

    if (asiento.origen === "COMPRA") {
        return `/facturas-compra/${asiento.comprobante.id}/editar`;
    }

    if (asiento.origen === "VENTA") {
        return `/facturas-venta/${asiento.comprobante.id}`;
    }

    return null;
}

function getComprobanteLabel(asiento: AsientoContableDetalle) {
    if (asiento.origen === "COMPRA") {
        return "Ver factura de compra";
    }

    if (asiento.origen === "VENTA") {
        return "Ver factura de venta";
    }

    return "Ver comprobante";
}

function isAsientoManualEditable(asiento: AsientoContableDetalle) {
    return asiento.origen === "MANUAL" && !asiento.comprobante;
}

function isAsientoEliminable(asiento: AsientoContableDetalle) {
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

export function AsientoContableDetalleView({
    asiento,
}: AsientoContableDetalleViewProps) {
    const puedeEditar = isAsientoManualEditable(asiento);
    const puedeEliminar = isAsientoEliminable(asiento);
    const comprobanteHref = getComprobanteHref(asiento);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Asiento contable N° {asiento.numero}
                        </h1>

                        <p className="text-sm text-slate-500">
                            Detalle del asiento contable registrado.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                        href="/asientos-contables"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Link>

                    {comprobanteHref && (
                        <Link
                            href={comprobanteHref}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <ReceiptText className="h-4 w-4" />
                            {getComprobanteLabel(asiento)}
                        </Link>
                    )}

                    {puedeEditar && (
                        <Link
                            href={`/asientos-contables/${asiento.id}/editar`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <Edit className="h-4 w-4" />
                            Editar
                        </Link>
                    )}

                    {puedeEliminar && (
                        <DeleteAsientoContableButton
                            asientoId={asiento.id}
                            asientoNumero={asiento.numero}
                            redirectTo="/asientos-contables"
                            variant="button"
                            label="Eliminar asiento"
                        />
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Datos del asiento
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Información general del asiento contable.
                    </p>
                </div>

                <div className="grid gap-0 divide-y divide-slate-100 md:grid-cols-4 md:divide-x md:divide-y-0">
                    <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Fecha
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            {formatDate(asiento.fecha)}
                        </p>
                    </div>

                    <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Origen
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            {getOrigenLabel(asiento.origen)}
                        </p>
                    </div>

                    <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Estado
                        </p>

                        <div className="mt-1">
                            <span className={getEstadoClassName(asiento.estado)}>
                                {getEstadoLabel(asiento.estado)}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Comprobante
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            {formatComprobante(asiento)}
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-100 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Concepto
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-900">
                        {asiento.concepto}
                    </p>

                    {asiento.sucursal && (
                        <p className="mt-2 text-sm text-slate-500">
                            Sucursal:{" "}
                            <span className="font-medium text-slate-700">
                                {asiento.sucursal.nombre}
                            </span>
                        </p>
                    )}

                    {asiento.comprobante && (
                        <p className="mt-2 text-sm text-slate-500">
                            Asiento relacionado al comprobante:{" "}
                            <span className="font-medium text-slate-700">
                                {formatComprobante(asiento)}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                        <Layers3 className="h-4 w-4 text-slate-600" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Detalle contable
                        </h2>

                        <p className="text-sm text-slate-500">
                            Cuentas utilizadas en el asiento.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Cuenta
                                </th>

                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Descripción
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Debe
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Haber
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {asiento.detalles.map((detalle) => (
                                <tr
                                    key={detalle.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-3 py-3">
                                        <p className="font-medium text-slate-900">
                                            {detalle.cuentaContable.codigo} -{" "}
                                            {detalle.cuentaContable.nombre}
                                        </p>
                                    </td>

                                    <td className="px-3 py-3 text-slate-600">
                                        {detalle.descripcion || "-"}
                                    </td>

                                    <td className="px-3 py-3 text-right font-medium text-slate-900">
                                        {formatCurrency(detalle.debe)}
                                    </td>

                                    <td className="px-3 py-3 text-right font-medium text-slate-900">
                                        {formatCurrency(detalle.haber)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="border-t border-slate-200 bg-slate-50">
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-3 py-3 text-right text-sm font-semibold text-slate-700"
                                >
                                    Totales
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(asiento.totalDebe)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(asiento.totalHaber)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}