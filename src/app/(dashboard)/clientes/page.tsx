import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { getClientesAction } from "@/features/clientes/actions";
import { ClientesTable } from "@/features/clientes/components";
import { Pagination, SearchInput } from "@/components/shared";

interface ClientesPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function ClientesPage({
    searchParams,
}: ClientesPageProps) {
    const params = await searchParams;

    const page = Number(params.page ?? "1");
    const search = params.search ?? "";

    const { clientes, pagination } = await getClientesAction({
        page,
        limit: 10,
        search,
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Users className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Clientes
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administre los clientes de la empresa activa.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/clientes/nuevo"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo cliente
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/clientes"
                                placeholder="Buscar por nombre, documento o email..."
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "cliente registrado"
                                : "clientes registrados"}
                        </div>
                    </div>
                </div>

                <ClientesTable clientes={clientes} />

                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    basePath="/clientes"
                    search={search}
                />
            </div>
        </div>
    );
}