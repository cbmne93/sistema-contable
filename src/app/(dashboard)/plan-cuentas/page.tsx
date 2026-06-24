import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

import { Pagination, SearchInput } from "@/components/shared";
import { getCuentasContablesAction } from "@/features/plan-cuentas/actions";
import {
    CreatePlanCuentasBaseButton,
    PlanCuentasTable,
} from "@/features/plan-cuentas/components";

interface PlanCuentasPageProps {
    searchParams?: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function PlanCuentasPage({
    searchParams,
}: PlanCuentasPageProps) {
    const params = await searchParams;

    const page = Number(params?.page ?? "1");
    const search = params?.search ?? "";
    const limit = 10;

    const { ok, cuentas, pagination, message } =
        await getCuentasContablesAction({
            page,
            limit,
            search,
        });

    const hasCuentas = pagination.total > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <BookOpen className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Plan de cuentas
                        </h1>

                        <p className="text-sm text-slate-500">
                            Administre las cuentas contables de la empresa
                            activa.
                        </p>
                    </div>
                </div>

                {hasCuentas && (
                    <Link
                        href="/plan-cuentas/nueva"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva cuenta
                    </Link>
                )}
            </div>

            {!hasCuentas && ok && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Cargar plan de cuentas inicial
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                La empresa activa todavía no tiene cuentas
                                contables. Puede cargar un plan base para
                                comenzar a trabajar con asientos contables.
                            </p>
                        </div>

                        <CreatePlanCuentasBaseButton />
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/plan-cuentas"
                                placeholder="Buscar por código, cuenta o descripción..."
                            />
                        </div>

                        <div className="shrink-0 whitespace-nowrap text-sm text-slate-500">
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "cuenta registrada"
                                : "cuentas registradas"}
                        </div>
                    </div>
                </div>

                <PlanCuentasTable cuentas={cuentas} />

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    basePath="/plan-cuentas"
                    search={search}
                />
            </div>

            {!ok && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {message}
                </div>
            )}
        </div>
    );
}