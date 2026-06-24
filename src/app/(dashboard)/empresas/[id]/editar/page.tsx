import { notFound } from "next/navigation";

import { EmpresaForm } from "@/features/empresas/components";
import { getEmpresaByIdAction } from "@/features/empresas/actions";

interface EditarEmpresaPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarEmpresaPage({
    params,
}: EditarEmpresaPageProps) {
    const { id } = await params;

    const { empresa } = await getEmpresaByIdAction({ id });

    if (!empresa) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Editar empresa</h1>
                <p className="text-sm text-muted-foreground">
                    Modifique los datos de la empresa seleccionada.
                </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
                <EmpresaForm empresa={empresa} />
            </div>
        </div>
    );
}