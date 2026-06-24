import { formatComprobanteCurrency } from "../helpers/comprobante-formatters.helper";

interface ComprobanteTotalesCardProps {
    moneda: string;
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
    className?: string;
}

export function ComprobanteTotalesCard({
    moneda,
    exenta,
    gravada5,
    iva5,
    gravada10,
    iva10,
    total,
    className = "",
}: ComprobanteTotalesCardProps) {
    return (
        <div
            className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${className}`}
        >
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Exenta</span>
                    <span className="font-medium text-slate-900">
                        {formatComprobanteCurrency(exenta, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Gravada 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatComprobanteCurrency(gravada5, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">IVA 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatComprobanteCurrency(iva5, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Gravada 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatComprobanteCurrency(gravada10, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">IVA 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatComprobanteCurrency(iva10, moneda)}
                    </span>
                </div>

                <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between text-base">
                        <span className="font-semibold text-slate-700">
                            Total
                        </span>

                        <span className="font-bold text-slate-900">
                            {formatComprobanteCurrency(total, moneda)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}