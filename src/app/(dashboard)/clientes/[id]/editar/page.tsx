import { notFound } from "next/navigation";

import { getClienteByIdAction } from "@/features/clientes/actions";
import { ClienteForm } from "@/features/clientes/components";

interface EditarClientePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarClientePage({
    params,
}: EditarClientePageProps) {
    const { id } = await params;

    const { cliente } = await getClienteByIdAction({ id });

    if (!cliente) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Editar cliente</h1>
                <p className="text-sm text-muted-foreground">
                    Modifique los datos del cliente seleccionado.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <ClienteForm cliente={cliente} />
            </div>
        </div>
    );
}