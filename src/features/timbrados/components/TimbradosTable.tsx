import { FileText } from "lucide-react";

import type { Timbrado } from "../interfaces";
import {
    formatEstablecimientoPunto,
    formatFecha,
    formatRango,
    getTipoComprobanteLabel,
} from "../helpers";
import { EstadoBadge, OrigenBadge } from "./TimbradosTableBadges";
import { TimbradosTableActions } from "./TimbradosTableActions";
import { TimbradosTableEmpty } from "./TimbradosTableEmpty";

type OrigenFiltro = "PROPIO" | "PROVEEDOR";

interface TimbradosTableProps {
    timbrados: Timbrado[];
    origen?: OrigenFiltro;
}

export function TimbradosTable({ timbrados, origen }: TimbradosTableProps) {
    if (origen === "PROPIO") {
        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-225 text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Timbrado
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Sucursal
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Est. / P. Exp.
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Rango
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Vencimiento
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
                            {timbrados.length === 0 ? (
                                <TimbradosTableEmpty colSpan={7} />
                            ) : (
                                timbrados.map((timbrado) => (
                                    <tr
                                        key={timbrado.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <FileText className="h-4 w-4 text-slate-500" />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {timbrado.numero}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {getTipoComprobanteLabel(
                                                            timbrado.tipoComprobante
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="font-medium text-slate-700">
                                                {timbrado.sucursal?.nombre ?? "-"}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 font-medium text-slate-700">
                                            {formatEstablecimientoPunto(timbrado)}
                                        </td>

                                        <td className="px-4 py-4 font-medium text-slate-700">
                                            {formatRango(timbrado)}
                                        </td>

                                        <td className="px-4 py-4 text-slate-700">
                                            {formatFecha(timbrado.fechaFin)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <EstadoBadge
                                                estado={timbrado.estado}
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <TimbradosTableActions
                                                timbrado={timbrado}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (origen === "PROVEEDOR") {
        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-212.5 text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Timbrado
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Proveedor
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    RUC
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Tipo comprobante
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Vencimiento
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
                            {timbrados.length === 0 ? (
                                <TimbradosTableEmpty colSpan={7} />
                            ) : (
                                timbrados.map((timbrado) => (
                                    <tr
                                        key={timbrado.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <FileText className="h-4 w-4 text-slate-500" />
                                                </div>

                                                <p className="font-medium text-slate-900">
                                                    {timbrado.numero}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 font-medium text-slate-700">
                                            {timbrado.proveedor?.nombre ?? "-"}
                                        </td>

                                        <td className="px-4 py-4 text-slate-700">
                                            {timbrado.proveedor
                                                ?.numeroDocumento ?? "-"}
                                        </td>

                                        <td className="px-4 py-4 text-slate-700">
                                            {getTipoComprobanteLabel(
                                                timbrado.tipoComprobante
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-slate-700">
                                            {formatFecha(timbrado.fechaFin)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <EstadoBadge
                                                estado={timbrado.estado}
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <TimbradosTableActions
                                                timbrado={timbrado}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-212.5 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Timbrado
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Origen
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Sucursal / Proveedor
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Vencimiento
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
                        {timbrados.length === 0 ? (
                            <TimbradosTableEmpty colSpan={6} />
                        ) : (
                            timbrados.map((timbrado) => (
                                <tr
                                    key={timbrado.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <FileText className="h-4 w-4 text-slate-500" />
                                            </div>

                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {timbrado.numero}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {getTipoComprobanteLabel(
                                                        timbrado.tipoComprobante
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <OrigenBadge origen={timbrado.origen} />
                                    </td>

                                    <td className="px-4 py-4">
                                        {timbrado.origen === "PROPIO" ? (
                                            <p className="font-medium text-slate-700">
                                                {timbrado.sucursal?.nombre ?? "-"}
                                            </p>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-slate-700">
                                                    {timbrado.proveedor?.nombre ??
                                                        "-"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {timbrado.proveedor
                                                        ?.numeroDocumento
                                                        ? `RUC ${timbrado.proveedor.numeroDocumento}`
                                                        : "Proveedor"}
                                                </p>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 text-slate-700">
                                        {formatFecha(timbrado.fechaFin)}
                                    </td>

                                    <td className="px-4 py-4">
                                        <EstadoBadge estado={timbrado.estado} />
                                    </td>

                                    <td className="px-4 py-4">
                                        <TimbradosTableActions
                                            timbrado={timbrado}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}