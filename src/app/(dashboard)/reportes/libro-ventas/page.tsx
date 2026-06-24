import { BookOpenText, FileSpreadsheet, FileText } from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";
import { getLibroVentasAction } from "@/features/reportes/libro-ventas/actions";
import {
    LibroVentasFilters,
    LibroVentasResumen,
    LibroVentasTable,
} from "@/features/reportes/libro-ventas/components";
import {
    getValidDate,
    getValidMonth,
    getValidPage,
} from "@/features/reportes/helpers";

interface LibroVentasPageProps {
    searchParams: Promise<{
        page?: string;
        month?: string;
        clienteId?: string;
        fechaDesde?: string;
        fechaHasta?: string;
    }>;
}

function buildExcelHref({
    month,
    clienteId,
    fechaDesde,
    fechaHasta,
}: {
    month: string;
    clienteId: string;
    fechaDesde: string;
    fechaHasta: string;
}) {
    const params = new URLSearchParams();

    if (month) params.set("month", month);
    if (clienteId) params.set("clienteId", clienteId);
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);

    return `/reportes/libro-ventas/excel?${params.toString()}`;
}

function buildPdfHref({
    month,
    clienteId,
    fechaDesde,
    fechaHasta,
}: {
    month: string;
    clienteId: string;
    fechaDesde: string;
    fechaHasta: string;
}) {
    const params = new URLSearchParams();

    if (month) params.set("month", month);
    if (clienteId) params.set("clienteId", clienteId);
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);

    return `/reportes/libro-ventas/pdf?${params.toString()}`;
}

export default async function LibroVentasPage({
    searchParams,
}: LibroVentasPageProps) {
    const params = await searchParams;

    const page = getValidPage(params.page);
    const month = getValidMonth(params.month);
    const clienteId = params.clienteId?.trim() ?? "";
    const fechaDesde = getValidDate(params.fechaDesde);
    const fechaHasta = getValidDate(params.fechaHasta);

    const response = await getLibroVentasAction({
        page,
        limit: 10,
        search: "",
        month: month as "all" | `${number}`,
        clienteId,
        fechaDesde,
        fechaHasta,
    });

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <BookOpenText className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Libro de ventas
                        </h1>

                        <p className="text-sm text-slate-500">
                            Consulte ventas por mes, cliente o rango de fechas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <a
                        href={buildExcelHref({
                            month,
                            clienteId,
                            fechaDesde,
                            fechaHasta,
                        })}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel
                    </a>

                    <a
                        href={buildPdfHref({
                            month,
                            clienteId,
                            fechaDesde,
                            fechaHasta,
                        })}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-100"
                    >
                        <FileText className="h-4 w-4" />
                        PDF
                    </a>
                </div>
            </div>

            {!response.ok && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    {response.message}
                </div>
            )}

            <LibroVentasFilters
                month={month}
                clienteId={clienteId}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                clientes={response.clientes}
            />

            <LibroVentasResumen resumen={response.resumen} />

            <LibroVentasTable
                registros={response.registros}
                totales={response.totales}
            />

            <Pagination
                page={response.pagination.page}
                totalPages={response.pagination.totalPages}
                basePath="/reportes/libro-ventas"
                month={month}
                clienteId={clienteId}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
            />
        </div>
    );
}