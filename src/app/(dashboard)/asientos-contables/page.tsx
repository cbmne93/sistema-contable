import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { Pagination, SearchInput } from "@/components/shared";
import { getAsientosContablesAction } from "@/features/asientos-contables/actions";
import { AsientosContablesTable } from "@/features/asientos-contables/components";

interface AsientosContablesPageProps {
    searchParams?: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function AsientosContablesPage({
    searchParams,
}: AsientosContablesPageProps) {
    const params = await searchParams;

    const page = Number(params?.page ?? "1");
    const search = params?.search ?? "";
    const limit = 10;

    const { asientos, pagination, ok, message, periodoFiscal } =
        await getAsientosContablesAction({
            page,
            limit,
            search,
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Asientos contables
                        </h1>

                        <p className="text-sm text-slate-500">
                            Administre los asientos contables del periodo fiscal
                            activo.
                        </p>
                    </div>
                </div>

                <Link
                    href="/asientos-contables/nuevo"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo asiento
                </Link>
            </div>

            {periodoFiscal && (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    Periodo fiscal activo:{" "}
                    <span className="font-semibold text-slate-900">
                        {periodoFiscal.anio}
                    </span>{" "}
                    - {periodoFiscal.descripcion}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/asientos-contables"
                                placeholder="Buscar por número o concepto..."
                            />
                        </div>

                        <div className="shrink-0 whitespace-nowrap text-sm text-slate-500">
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "asiento registrado"
                                : "asientos registrados"}
                        </div>
                    </div>
                </div>

                <AsientosContablesTable asientos={asientos} />

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    basePath="/asientos-contables"
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