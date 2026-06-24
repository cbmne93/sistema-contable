import Link from "next/link";
import { CalendarDays, CircleUserRound } from "lucide-react";

import { auth } from "../../../auth";
import { EmpresaActivaBadge } from "@/features/empresas/components";
import type { Empresa } from "@/features/empresas/interfaces";

import { LogoutButton } from "./LogoutButton";

interface PeriodoFiscalActivo {
    id: string;
    anio: number;
    descripcion: string;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    estado: string;
}

interface AppHeaderProps {
    empresaActiva: Empresa | null;
    periodoFiscalActivo: PeriodoFiscalActivo | null;
}

export async function AppHeader({
    empresaActiva,
    periodoFiscalActivo,
}: AppHeaderProps) {
    const session = await auth();

    const usuarioNombre =
        session?.user?.name || session?.user?.email || "Usuario";

    return (
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
            <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-slate-950">
                    Panel administrativo
                </h2>

                <p className="truncate text-sm text-slate-500">
                    Gestión contable y administrativa
                </p>
            </div>

            <div className="flex min-w-0 items-center justify-end gap-3">
                {periodoFiscalActivo && (
                    <Link
                        href="/periodos-fiscales"
                        title="Cambiar periodo fiscal"
                        className="hidden h-9 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 transition hover:bg-slate-100 lg:inline-flex"
                    >
                        <CalendarDays className="h-4 w-4 text-slate-500" />

                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Periodo:
                        </span>

                        <span className="font-semibold text-slate-900">
                            {periodoFiscalActivo.anio}
                        </span>
                    </Link>
                )}

                <EmpresaActivaBadge empresa={empresaActiva} />

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    <CircleUserRound className="h-5 w-5 text-slate-500" />

                    <span className="max-w-32 truncate text-sm font-medium text-slate-700">
                        {usuarioNombre}
                    </span>
                </div>

                <LogoutButton />
            </div>
        </header>
    );
}