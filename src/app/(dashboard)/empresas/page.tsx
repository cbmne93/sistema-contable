import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { SearchInput } from "@/components/shared";
import { getEmpresasAction } from "@/features/empresas/actions";
import { EmpresasTable } from "@/features/empresas/components";

interface EmpresasPageProps {
    searchParams?: Promise<{
        search?: string;
    }>;
}

export default async function EmpresasPage({ searchParams }: EmpresasPageProps) {
    const params = await searchParams;

    const search = params?.search?.trim().toLowerCase() ?? "";

    const { empresas } = await getEmpresasAction();

    const empresasFiltradas = search
        ? empresas.filter((empresa) => {
            const texto = [
                empresa.razonSocial,
                empresa.ruc,
                empresa.dv,
                empresa.email,
                empresa.estado,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return texto.includes(search);
        })
        : empresas;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Empresas
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administre las empresas disponibles en el sistema.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/empresas/nueva"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nueva empresa
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/empresas"
                                placeholder="Buscar por empresa, RUC o email..."
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            {empresasFiltradas.length}{" "}
                            {empresasFiltradas.length === 1
                                ? "empresa registrada"
                                : "empresas registradas"}
                        </div>
                    </div>
                </div>

                <EmpresasTable empresas={empresasFiltradas} />
            </div>
        </div>
    );
}