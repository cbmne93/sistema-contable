interface LibroVentasResumenProps {
    resumen: {
        cantidadComprobantes: number;
        totalVentas: number;
        totalIva5: number;
        totalIva10: number;
        totalIva: number;
    };
}

const numberFormatter = new Intl.NumberFormat("es-PY");

function formatGuaranies(value: number) {
    return `${numberFormatter.format(value)} Gs.`;
}

export function LibroVentasResumen({ resumen }: LibroVentasResumenProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Comprobantes
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {resumen.cantidadComprobantes}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Total ventas
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatGuaranies(resumen.totalVentas)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    IVA 5%
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatGuaranies(resumen.totalIva5)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    IVA 10%
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatGuaranies(resumen.totalIva10)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    IVA total
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {formatGuaranies(resumen.totalIva)}
                </p>
            </div>
        </div>
    );
}