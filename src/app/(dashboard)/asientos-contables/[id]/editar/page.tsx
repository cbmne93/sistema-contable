import { notFound } from "next/navigation";

import {
    getAsientoContableFormByIdAction,
    getAsientoContableFormOptionsAction,
} from "@/features/asientos-contables/actions";
import { AsientoContableForm } from "@/features/asientos-contables/components";

interface EditarAsientoContablePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarAsientoContablePage({
    params,
}: EditarAsientoContablePageProps) {
    const { id } = await params;

    const [asientoResponse, optionsResponse] = await Promise.all([
        getAsientoContableFormByIdAction(id),
        getAsientoContableFormOptionsAction(),
    ]);

    if (!asientoResponse.ok || !asientoResponse.asiento) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Editar asiento contable
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Modifique los datos del asiento manual seleccionado.
                </p>
            </div>

            {!optionsResponse.ok && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {optionsResponse.message}
                </div>
            )}

            {optionsResponse.ok && (
                <AsientoContableForm
                    options={optionsResponse.options}
                    asientoId={id}
                    initialData={asientoResponse.asiento}
                />
            )}
        </div>
    );
}