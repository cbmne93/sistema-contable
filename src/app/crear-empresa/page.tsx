import { Building2 } from "lucide-react";

import { EmpresaForm } from "@/features/empresas/components";

export default function CrearEmpresaPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-3xl space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                        <Building2 className="h-7 w-7" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Crear primera empresa
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Registre la empresa principal para comenzar a usar el
                        sistema.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <EmpresaForm
                        seleccionarAlCrear
                        redirectAfterSave="/dashboard"
                        cancelHref="/seleccionar-empresa"
                    />
                </div>
            </div>
        </main>
    );
}