import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";

import {
    getCuentaContableByIdAction,
    getCuentaContableFormOptionsAction,
} from "@/features/plan-cuentas/actions";
import { CuentaContableForm } from "@/features/plan-cuentas/components";

interface EditarCuentaContablePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarCuentaContablePage({
    params,
}: EditarCuentaContablePageProps) {
    const { id } = await params;

    const [cuentaResponse, optionsResponse] = await Promise.all([
        getCuentaContableByIdAction(id),
        getCuentaContableFormOptionsAction(),
    ]);

    if (!cuentaResponse.ok || !cuentaResponse.cuenta) {
        notFound();
    }

    const cuentasPadre = optionsResponse.cuentasPadre.filter(
        (cuenta) => cuenta.id !== id
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <BookOpen className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Editar cuenta contable
                    </h1>

                    <p className="text-sm text-slate-500">
                        Actualice los datos de la cuenta seleccionada.
                    </p>
                </div>
            </div>

            <CuentaContableForm
                cuentasPadre={cuentasPadre}
                cuentaId={id}
                initialData={cuentaResponse.cuenta}
            />
        </div>
    );
}