import { Settings2 } from "lucide-react";

import { getConfiguracionContableAction } from "@/features/configuracion-contable/actions";
import { ConfiguracionContableForm } from "@/features/configuracion-contable/components";

export default async function ConfiguracionContablePage() {
    const { ok, message, configuracion, options } =
        await getConfiguracionContableAction();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Settings2 className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Configuración contable
                    </h1>

                    <p className="text-sm text-slate-500">
                        Defina las cuentas que se usarán para generar asientos
                        automáticos desde compras y ventas.
                    </p>
                </div>
            </div>

            {!ok && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {message}
                </div>
            )}

            {ok && options.cuentas.length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    No hay cuentas contables de movimiento disponibles. Primero
                    debe crear cuentas activas que acepten movimiento en el Plan
                    de cuentas.
                </div>
            )}

            {ok && (
                <ConfiguracionContableForm
                    configuracion={configuracion}
                    options={options}
                />
            )}
        </div>
    );
}