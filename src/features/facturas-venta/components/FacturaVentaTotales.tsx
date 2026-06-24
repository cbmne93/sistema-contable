import { formatCurrency } from "../utils/factura-calculos";

interface TotalesFacturaVenta {
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
}

interface FacturaVentaTotalesProps {
    totales: TotalesFacturaVenta;
    moneda: string;
}

export function FacturaVentaTotales({
    totales,
    moneda,
}: FacturaVentaTotalesProps) {
    return (
        <div className="ml-auto max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Exenta</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.exenta, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Gravada 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.gravada5, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">IVA 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.iva5, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Gravada 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.gravada10, moneda)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">IVA 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.iva10, moneda)}
                    </span>
                </div>

                <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between text-base">
                        <span className="font-semibold text-slate-700">
                            Total
                        </span>
                        <span className="font-bold text-slate-900">
                            {formatCurrency(totales.total, moneda)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}