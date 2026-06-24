import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    basePath: string;
    search?: string;
    origen?: string;
    sort?: string;
    order?: string;
    month?: string;
    proveedorId?: string;
    clienteId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}

function getVisiblePages(page: number, totalPages: number) {
    const pages: Array<number | "..."> = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    }

    pages.push(1);

    if (page > 4) {
        pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (page < totalPages - 3) {
        pages.push("...");
    }

    pages.push(totalPages);

    return pages;
}

export function Pagination({
    page,
    totalPages,
    basePath,
    search = "",
    origen = "",
    sort = "",
    order = "",
    month = "",
    proveedorId = "",
    clienteId = "",
    fechaDesde = "",
    fechaHasta = "",
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const createHref = (targetPage: number) => {
        const params = new URLSearchParams();

        params.set("page", String(targetPage));

        if (search) {
            params.set("search", search);
        }

        if (origen) {
            params.set("origen", origen);
        }

        if (sort) {
            params.set("sort", sort);
        }

        if (order) {
            params.set("order", order);
        }

        if (month) {
            params.set("month", month);
        }
        if (proveedorId) {
            params.set("proveedorId", proveedorId);
        }

        if (clienteId) {
            params.set("clienteId", clienteId);
        }

        if (fechaDesde) {
            params.set("fechaDesde", fechaDesde);
        }

        if (fechaHasta) {
            params.set("fechaHasta", fechaHasta);
        }

        return `${basePath}?${params.toString()}`;
    };

    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    const visiblePages = getVisiblePages(page, totalPages);

    return (
        <div className="flex items-center justify-center border-t border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
                {canGoPrevious ? (
                    <Link
                        href={createHref(page - 1)}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Link>
                ) : (
                    <span className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 text-sm font-medium text-slate-400">
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </span>
                )}

                <div className="flex items-center gap-1">
                    {visiblePages.map((item, index) => {
                        if (item === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-sm font-medium text-slate-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === page;

                        return (
                            <Link
                                key={item}
                                href={createHref(item)}
                                className={
                                    isActive
                                        ? "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white shadow-sm"
                                        : "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                }
                            >
                                {item}
                            </Link>
                        );
                    })}
                </div>

                {canGoNext ? (
                    <Link
                        href={createHref(page + 1)}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 text-sm font-medium text-slate-400">
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </div>
        </div>
    );
}