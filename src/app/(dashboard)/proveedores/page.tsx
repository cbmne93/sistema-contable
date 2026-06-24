import Link from "next/link";
import { Plus, UserRound } from "lucide-react";

import { SearchInput } from "@/components/shared";
import { getProveedoresAction } from "@/features/proveedores/actions";
import { ProveedoresTable } from "@/features/proveedores/components";

interface ProveedoresPageProps {
    searchParams?: Promise<{
        search?: string;
    }>;
}

export default async function ProveedoresPage({
    searchParams,
}: ProveedoresPageProps) {
    const params = await searchParams;

    const search = params?.search?.trim().toLowerCase() ?? "";

    const { proveedores } = await getProveedoresAction();

    const proveedoresFiltrados = search
        ? proveedores.filter((proveedor) => {
            const texto = [
                proveedor.nombre,
                proveedor.numeroDocumento,
                proveedor.dv,
                proveedor.email,
                proveedor.telefono,
                proveedor.tipoDocumento,
                proveedor.tipoPersona,
                proveedor.estado,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return texto.includes(search);
        })
        : proveedores;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Proveedores
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administre los proveedores de la empresa activa.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/proveedores/nuevo"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo proveedor
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/proveedores"
                                placeholder="Buscar por proveedor, documento o email..."
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            {proveedoresFiltrados.length}{" "}
                            {proveedoresFiltrados.length === 1
                                ? "proveedor registrado"
                                : "proveedores registrados"}
                        </div>
                    </div>
                </div>

                <ProveedoresTable proveedores={proveedoresFiltrados} />
            </div>
        </div>
    );
}