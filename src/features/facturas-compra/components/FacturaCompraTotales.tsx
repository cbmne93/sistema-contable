import type { TotalesFacturaCompra } from "../utils";
import { formatCurrency } from "../utils";

interface FacturaCompraTotalesProps {
    totales: TotalesFacturaCompra;
    moneda: string;
}

export function FacturaCompraTotales({
    totales,
    moneda,
}: FacturaCompraTotalesProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="ml-auto w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Exenta</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.exenta, moneda)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Gravada 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.gravada5, moneda)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">IVA 5%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.iva5, moneda)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Gravada 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.gravada10, moneda)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">IVA 10%</span>
                    <span className="font-medium text-slate-900">
                        {formatCurrency(totales.iva10, moneda)}
                    </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-slate-900">
                            Total
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                            {formatCurrency(totales.total, moneda)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}