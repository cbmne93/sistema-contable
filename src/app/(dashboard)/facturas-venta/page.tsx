import Link from "next/link";
import { CalendarDays, FileText, Plus } from "lucide-react";

import { MonthFilter, Pagination, SearchInput } from "@/components/shared";
import { getFacturasVentaAction } from "@/features/facturas-venta/actions";
import { FacturasVentaTable } from "@/features/facturas-venta/components";

type FacturasVentaSort = "createdAt" | "factura" | "fecha";
type SortOrder = "asc" | "desc";
type MonthFilterValue = "all" | `${number}`;

interface FacturasPageProps {
    searchParams?: Promise<{
        page?: string;
        search?: string;
        sort?: string;
        order?: string;
        month?: string;
    }>;
}

function parseSort(value?: string): FacturasVentaSort {
    if (value === "factura" || value === "fecha") {
        return value;
    }

    return "createdAt";
}

function parseOrder(value?: string): SortOrder {
    if (value === "asc" || value === "desc") {
        return value;
    }

    return "desc";
}

function parseMonth(value?: string): MonthFilterValue {
    if (value === "all") {
        return "all";
    }

    const monthNumber = Number(value);

    if (
        Number.isInteger(monthNumber) &&
        monthNumber >= 1 &&
        monthNumber <= 12
    ) {
        return String(monthNumber) as MonthFilterValue;
    }

    return String(new Date().getMonth() + 1) as MonthFilterValue;
}

function formatDate(date: Date | string | null | undefined) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}

export default async function FacturasPage({
    searchParams,
}: FacturasPageProps) {
    const params = await searchParams;

    const page = Number(params?.page ?? "1");
    const search = params?.search ?? "";
    const sort = parseSort(params?.sort);
    const order = parseOrder(params?.order);
    const month = parseMonth(params?.month);
    const limit = 10;

    const { facturas, pagination, message, ok, periodoFiscal, filtros } =
        await getFacturasVentaAction({
            page,
            limit,
            search,
            sort,
            order,
            month,
        });

    const selectedMonth = filtros?.month ?? month;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Facturas de venta
                            </h1>

                            <p className="text-sm text-slate-500">
                                Consulte y cargue facturas de venta.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/facturas-venta/nueva"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nueva factura
                </Link>
            </div>

            {periodoFiscal && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <CalendarDays className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Periodo fiscal {periodoFiscal.anio}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Desde el{" "}
                                    {formatDate(periodoFiscal.fechaInicio)} al{" "}
                                    {formatDate(periodoFiscal.fechaFin)}
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {periodoFiscal.estado}
                        </span>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="w-full lg:max-w-md">
                                <SearchInput
                                    basePath="/facturas-venta"
                                    placeholder="Buscar por factura, timbrado, cliente o documento..."
                                />
                            </div>

                            <MonthFilter
                                basePath="/facturas-venta"
                                value={selectedMonth}
                            />
                        </div>

                        <div className="shrink-0 whitespace-nowrap text-sm text-slate-500">
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "factura registrada"
                                : "facturas registradas"}
                        </div>
                    </div>
                </div>

                <FacturasVentaTable
                    facturas={facturas}
                    search={search}
                    sort={sort}
                    order={order}
                />

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    basePath="/facturas-venta"
                    search={search}
                    sort={sort}
                    order={order}
                    month={selectedMonth}
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