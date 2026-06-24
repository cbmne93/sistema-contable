import Link from "next/link";
import { Plus, Store } from "lucide-react";

import { SearchInput } from "@/components/shared";
import { getSucursalesAction } from "@/features/sucursales/actions";
import { SucursalesTable } from "@/features/sucursales/components";

interface SucursalesPageProps {
    searchParams?: Promise<{
        search?: string;
    }>;
}

export default async function SucursalesPage({
    searchParams,
}: SucursalesPageProps) {
    const params = await searchParams;

    const search = params?.search?.trim().toLowerCase() ?? "";

    const { sucursales } = await getSucursalesAction();

    const sucursalesFiltradas = search
        ? sucursales.filter((sucursal) => {
            const texto = [
                sucursal.nombre,
                sucursal.codigo,
                sucursal.direccion,
                sucursal.telefono,
                sucursal.estado,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return texto.includes(search);
        })
        : sucursales;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Store className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Sucursales
                            </h1>

                            <p className="text-sm text-slate-500">
                                Administre las sucursales de la empresa activa.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/sucursales/nueva"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Nueva sucursal
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:max-w-md">
                            <SearchInput
                                basePath="/sucursales"
                                placeholder="Buscar por sucursal, código o teléfono..."
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            {sucursalesFiltradas.length}{" "}
                            {sucursalesFiltradas.length === 1
                                ? "sucursal registrada"
                                : "sucursales registradas"}
                        </div>
                    </div>
                </div>

                <SucursalesTable sucursales={sucursalesFiltradas} />
            </div>
        </div>
    );
}