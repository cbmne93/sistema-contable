import { BookOpenText, FileSpreadsheet, FileText } from "lucide-react";

import { Pagination } from "@/components/shared/Pagination";
import { getLibroComprasAction } from "@/features/reportes/libro-compras/actions";
import {
    LibroComprasFilters,
    LibroComprasResumen,
    LibroComprasTable,
} from "@/features/reportes/libro-compras/components";
import {
    getValidDate,
    getValidMonth,
    getValidPage,
} from "@/features/reportes/helpers";

interface LibroComprasPageProps {
    searchParams: Promise<{
        page?: string;
        month?: string;
        proveedorId?: string;
        fechaDesde?: string;
        fechaHasta?: string;
    }>;
}

function buildExcelHref({
    month,
    proveedorId,
    fechaDesde,
    fechaHasta,
}: {
    month: string;
    proveedorId: string;
    fechaDesde: string;
    fechaHasta: string;
}) {
    const params = new URLSearchParams();

    if (month) params.set("month", month);
    if (proveedorId) params.set("proveedorId", proveedorId);
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);

    return `/reportes/libro-compras/excel?${params.toString()}`;
}

function buildPdfHref({
    month,
    proveedorId,
    fechaDesde,
    fechaHasta,
}: {
    month: string;
    proveedorId: string;
    fechaDesde: string;
    fechaHasta: string;
}) {
    const params = new URLSearchParams();

    if (month) params.set("month", month);
    if (proveedorId) params.set("proveedorId", proveedorId);
    if (fechaDesde) params.set("fechaDesde", fechaDesde);
    if (fechaHasta) params.set("fechaHasta", fechaHasta);

    return `/reportes/libro-compras/pdf?${params.toString()}`;
}

export default async function LibroComprasPage({
    searchParams,
}: LibroComprasPageProps) {
    const params = await searchParams;

    const page = getValidPage(params.page);
    const month = getValidMonth(params.month);
    const proveedorId = params.proveedorId?.trim() ?? "";
    const fechaDesde = getValidDate(params.fechaDesde);
    const fechaHasta = getValidDate(params.fechaHasta);

    const response = await getLibroComprasAction({
        page,
        limit: 10,
        search: "",
        month: month as "all" | `${number}`,
        proveedorId,
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
                            Libro de compras
                        </h1>

                        <p className="text-sm text-slate-500">
                            Consulte compras por mes, proveedor o rango de
                            fechas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <a
                        href={buildExcelHref({
                            month,
                            proveedorId,
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
                            proveedorId,
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

            <LibroComprasFilters
                month={month}
                proveedorId={proveedorId}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                proveedores={response.proveedores}
            />

            <LibroComprasResumen resumen={response.resumen} />

            <LibroComprasTable
                registros={response.registros}
                totales={response.totales}
            />

            <Pagination
                page={response.pagination.page}
                totalPages={response.pagination.totalPages}
                basePath="/reportes/libro-compras"
                month={month}
                proveedorId={proveedorId}
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
            />
        </div>
    );
}