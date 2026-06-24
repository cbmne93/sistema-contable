import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getEmpresaActivaAction } from "@/features/empresas/actions";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { empresa } = await getEmpresaActivaAction();

    if (!empresa) {
        redirect("/seleccionar-empresa");
    }

    const periodoFiscalActivo = await getPeriodoFiscalActivoOrThrow(empresa.id);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <AppSidebar />

                <main className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <AppHeader
                        empresaActiva={empresa}
                        periodoFiscalActivo={periodoFiscalActivo}
                    />

                    <section className="min-w-0 flex-1 p-6">
                        <div className="mx-auto w-full max-w-7xl min-w-0">
                            {children}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}