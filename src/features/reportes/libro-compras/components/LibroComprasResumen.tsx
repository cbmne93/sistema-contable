import { formatReportCurrency } from "@/features/reportes/helpers";

interface LibroComprasResumenProps {
    resumen: {
        cantidadComprobantes: number;
        totalCompras: number;
        totalIva5: number;
        totalIva10: number;
        totalIva: number;
    };
}

function SummaryCard({
    title,
    value,
    helper,
}: {
    title: string;
    value: string;
    helper: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>

            <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
    );
}

export function LibroComprasResumen({ resumen }: LibroComprasResumenProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
                title="Comprobantes"
                value={String(resumen.cantidadComprobantes)}
                helper="Cantidad de facturas filtradas"
            />

            <SummaryCard
                title="Total compras"
                value={formatReportCurrency(resumen.totalCompras)}
                helper="Monto total del reporte"
            />

            <SummaryCard
                title="IVA 5%"
                value={formatReportCurrency(resumen.totalIva5)}
                helper="Crédito fiscal 5%"
            />

            <SummaryCard
                title="IVA 10%"
                value={formatReportCurrency(resumen.totalIva10)}
                helper={`IVA total: ${formatReportCurrency(resumen.totalIva)}`}
            />
        </div>
    );
}