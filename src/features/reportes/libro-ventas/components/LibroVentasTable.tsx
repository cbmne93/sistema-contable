interface LibroVentasTableProps {
    registros: {
        id: string;
        fechaEmision: Date;
        facturaNumero: string;
        numeroTimbrado: string;
        clienteNombre: string;
        clienteDocumento: string;
        moneda: string;
        exenta: number;
        gravada5: number;
        iva5: number;
        gravada10: number;
        iva10: number;
        total: number;
    }[];
    totales: {
        exenta: number;
        gravada5: number;
        iva5: number;
        gravada10: number;
        iva10: number;
        total: number;
    };
}

const numberFormatter = new Intl.NumberFormat("es-PY");

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

function formatNumber(value: number) {
    return numberFormatter.format(value);
}

export function LibroVentasTable({
    registros,
    totales,
}: LibroVentasTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-250 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Fecha
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Cliente
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Factura
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Exenta
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Grav. 5%
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                IVA 5%
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Grav. 10%
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                IVA 10%
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {registros.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    No se encontraron ventas para los filtros
                                    seleccionados.
                                </td>
                            </tr>
                        ) : (
                            registros.map((registro) => (
                                <tr
                                    key={registro.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                        {formatDate(registro.fechaEmision)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900">
                                            {registro.clienteNombre}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {registro.clienteDocumento}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                        {registro.facturaNumero}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                                        {formatNumber(registro.exenta)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                                        {formatNumber(registro.gravada5)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                                        {formatNumber(registro.iva5)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                                        {formatNumber(registro.gravada10)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                                        {formatNumber(registro.iva10)}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">
                                        {formatNumber(registro.total)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                    <tfoot className="border-t border-slate-200 bg-slate-50">
                        <tr>
                            <td
                                colSpan={3}
                                className="px-4 py-3 text-right font-semibold text-slate-700"
                            >
                                Totales
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.exenta)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.gravada5)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.iva5)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.gravada10)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.iva10)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                {formatNumber(totales.total)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}