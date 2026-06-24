import { FileText } from "lucide-react";

import { getAsientoContableFormOptionsAction } from "@/features/asientos-contables/actions";
import { AsientoContableForm } from "@/features/asientos-contables/components";

export default async function NuevoAsientoContablePage() {
    const { options, ok, message } =
        await getAsientoContableFormOptionsAction();

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Nuevo asiento contable
                        </h1>

                        <p className="text-sm text-slate-500">
                            Registre un asiento manual en el periodo fiscal
                            activo.
                        </p>
                    </div>
                </div>
            </div>

            {!ok && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {message}
                </div>
            )}

            {ok && <AsientoContableForm options={options} />}
        </div>
    );
}