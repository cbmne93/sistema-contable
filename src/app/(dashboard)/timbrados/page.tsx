import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { Pagination, SearchInput } from "@/components/shared";
import { getTimbradosAction } from "@/features/timbrados/actions";
import { TimbradosTable } from "@/features/timbrados/components";

type OrigenFiltro = "PROPIO" | "PROVEEDOR";

interface TimbradosPageProps {
    searchParams?: Promise<{
        page?: string;
        search?: string;
        origen?: string;
    }>;
}

function getOrigenValido(origen?: string): OrigenFiltro | undefined {
    if (origen === "PROPIO" || origen === "PROVEEDOR") {
        return origen;
    }

    return undefined;
}

function buildTabHref(origen?: OrigenFiltro, search?: string) {
    const params = new URLSearchParams();

    if (origen) {
        params.set("origen", origen);
    }

    if (search) {
        params.set("search", search);
    }

    const queryString = params.toString();

    return queryString ? `/timbrados?${queryString}` : "/timbrados";
}

export default async function TimbradosPage({
    searchParams,
}: TimbradosPageProps) {
    const params = await searchParams;

    const page = Number(params?.page || 1);
    const search = params?.search || "";
    const origen = getOrigenValido(params?.origen);
    const limit = 10;

    const result = await getTimbradosAction({
        page,
        limit,
        search,
        origen,
    });

    const tabs = [
        {
            label: "Todos",
            href: buildTabHref(undefined, search),
            active: !origen,
        },
        {
            label: "Propios / Ventas",
            href: buildTabHref("PROPIO", search),
            active: origen === "PROPIO",
        },
        {
            label: "Proveedores / Compras",
            href: buildTabHref("PROVEEDOR", search),
            active: origen === "PROVEEDOR",
        },
    ];

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
                                Timbrados
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administre los timbrados propios y de proveedores.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/timbrados/nuevo"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo timbrado
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.label}
                                href={tab.href}
                                className={
                                    tab.active
                                        ? "inline-flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-medium text-white shadow-sm"
                                        : "inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                }
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/timbrados"
                                placeholder="Buscar por timbrado, sucursal o proveedor..."
                                extraParams={origen ? { origen } : undefined}
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            {result.total}{" "}
                            {result.total === 1
                                ? "timbrado registrado"
                                : "timbrados registrados"}
                        </div>
                    </div>
                </div>

                <TimbradosTable timbrados={result.timbrados} origen={origen} />

                <Pagination
                    page={result.currentPage}
                    totalPages={result.totalPages}
                    basePath="/timbrados"
                    search={search}
                    origen={origen}
                />
            </div>

            {!result.ok && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {result.message}
                </div>
            )}
        </div>
    );
}