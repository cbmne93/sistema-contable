import { BookOpen } from "lucide-react";

import { getCuentaContableFormOptionsAction } from "@/features/plan-cuentas/actions";
import { CuentaContableForm } from "@/features/plan-cuentas/components";

export default async function NuevaCuentaContablePage() {
    const { cuentasPadre } = await getCuentaContableFormOptionsAction();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <BookOpen className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Nueva cuenta contable
                    </h1>

                    <p className="text-sm text-slate-500">
                        Registre una nueva cuenta en el plan de cuentas de la
                        empresa activa.
                    </p>
                </div>
            </div>

            <CuentaContableForm cuentasPadre={cuentasPadre} />
        </div>
    );
}