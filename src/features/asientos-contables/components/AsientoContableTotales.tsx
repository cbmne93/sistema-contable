import { CheckCircle2, AlertTriangle } from "lucide-react";

import { formatCurrency } from "../utils";

interface AsientoContableTotalesProps {
    totalDebe: number;
    totalHaber: number;
    diferencia: number;
    balanceado: boolean;
}

export function AsientoContableTotales({
    totalDebe,
    totalHaber,
    diferencia,
    balanceado,
}: AsientoContableTotalesProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Total debe
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                        {formatCurrency(totalDebe)}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Total haber
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                        {formatCurrency(totalHaber)}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Diferencia
                    </p>

                    <p
                        className={
                            diferencia === 0
                                ? "mt-1 text-lg font-semibold text-emerald-700"
                                : "mt-1 text-lg font-semibold text-red-700"
                        }
                    >
                        {formatCurrency(Math.abs(diferencia))}
                    </p>
                </div>

                <div className="flex items-center">
                    {balanceado ? (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Balanceado
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                            <AlertTriangle className="h-4 w-4" />
                            Pendiente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}