import Link from "next/link";

import { getEmpresasAction } from "@/features/empresas/actions";
import {
    AutoSeleccionarEmpresa,
    SeleccionarEmpresaForm,
} from "@/features/empresas/components";

export default async function SeleccionarEmpresaPage() {
    const { empresas } = await getEmpresasAction();

    const empresasActivas = empresas.filter(
        (empresa) => empresa.estado === "ACTIVO"
    );

    if (empresasActivas.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">
                        No hay empresas activas
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Para usar el sistema necesita registrar o activar una empresa.
                    </p>

                    <div className="mt-6">
                        <Link
                            href="/crear-empresa"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            Crear empresa
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (empresasActivas.length === 1) {
        return (
            <main className="min-h-screen bg-slate-100 px-4 py-10">
                <AutoSeleccionarEmpresa empresaId={empresasActivas[0].id} />
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <SeleccionarEmpresaForm empresas={empresasActivas} />
        </main>
    );
}