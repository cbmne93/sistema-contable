import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { createPeriodoFiscalAction } from "@/features/periodos-fiscales/actions";

interface NuevoPeriodoFiscalPageProps {
    searchParams?: Promise<{
        error?: string;
    }>;
}

export default async function NuevoPeriodoFiscalPage({
    searchParams,
}: NuevoPeriodoFiscalPageProps) {
    const params = await searchParams;
    const error = params?.error;

    const currentYear = new Date().getFullYear();

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    href="/periodos-fiscales"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a periodos fiscales
                </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Nuevo periodo fiscal
                            </h1>

                            <p className="text-sm text-slate-500">
                                Cree un nuevo año fiscal para la empresa activa.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        action={createPeriodoFiscalAction}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="anio"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Año fiscal
                            </label>

                            <input
                                id="anio"
                                name="anio"
                                type="number"
                                min={2000}
                                max={2100}
                                defaultValue={currentYear + 1}
                                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400"
                            />

                            <p className="mt-1.5 text-xs text-slate-500">
                                El sistema generará automáticamente las fechas
                                desde el 01/01 hasta el 31/12 del año indicado.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href="/periodos-fiscales"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Crear periodo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}