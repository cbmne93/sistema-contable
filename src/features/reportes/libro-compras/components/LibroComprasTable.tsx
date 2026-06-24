import { FileText } from "lucide-react";

interface LibroCompraRegistro {
    id: string;
    fechaEmision: Date | string;
    facturaNumero: string;
    numeroTimbrado: string;
    proveedorNombre: string;
    proveedorDocumento: string;
    moneda: string;
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
}

interface LibroComprasTableProps {
    registros: LibroCompraRegistro[];
    totales: {
        exenta: number;
        gravada5: number;
        iva5: number;
        gravada10: number;
        iva10: number;
        total: number;
    };
}

function formatFecha(fecha: Date | string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(fecha));
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export function LibroComprasTable({
    registros,
    totales,
}: LibroComprasTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-220 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Fecha
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Proveedor
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Exenta
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Grav. 5%
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                IVA 5%
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Grav. 10%
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                IVA 10%
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {registros.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-700">
                                            No hay registros para mostrar
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            No se encontraron facturas de compra
                                            con los filtros seleccionados.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            registros.map((registro) => (
                                <tr
                                    key={registro.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-3 py-3 text-slate-700">
                                        {formatFecha(registro.fechaEmision)}
                                    </td>

                                    <td className="px-3 py-3 font-medium text-slate-900">
                                        {registro.proveedorNombre}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatCurrency(registro.exenta)}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatCurrency(registro.gravada5)}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatCurrency(registro.iva5)}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatCurrency(registro.gravada10)}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatCurrency(registro.iva10)}
                                    </td>

                                    <td className="px-3 py-3 text-right font-semibold text-slate-900">
                                        {formatCurrency(registro.total)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                    {registros.length > 0 && (
                        <tfoot className="border-t border-slate-200 bg-slate-50">
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-3 py-3 text-right text-sm font-semibold text-slate-700"
                                >
                                    Totales
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(totales.exenta)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(totales.gravada5)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(totales.iva5)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(totales.gravada10)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900">
                                    {formatCurrency(totales.iva10)}
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-bold text-slate-900">
                                    {formatCurrency(totales.total)}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}