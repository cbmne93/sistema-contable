import { Building2 } from "lucide-react";

import type { Empresa } from "../interfaces";
import { CambiarEmpresaButton } from "./CambiarEmpresaButton";

interface EmpresaActivaBadgeProps {
    empresa: Empresa | null;
}

export function EmpresaActivaBadge({ empresa }: EmpresaActivaBadgeProps) {
    if (!empresa) {
        return (
            <div className="hidden shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 lg:block">
                Sin empresa activa
            </div>
        );
    }

    return (
        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 lg:flex">
            <Building2 className="h-4 w-4 shrink-0 text-slate-500" />

            <div className="flex min-w-0 items-center gap-2 text-sm">
                <span className="max-w-56 truncate font-semibold text-slate-800">
                    {empresa.razonSocial}
                </span>

                <span className="shrink-0 text-xs text-slate-400">|</span>

                <span className="shrink-0 text-xs text-slate-500">
                    RUC {empresa.ruc}-{empresa.dv}
                </span>
            </div>

            <CambiarEmpresaButton />
        </div>
    );
}