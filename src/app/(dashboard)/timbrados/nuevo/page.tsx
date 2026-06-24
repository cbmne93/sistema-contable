import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { TimbradoForm } from "@/features/timbrados/components";
import { getTimbradoFormOptionsAction } from "@/features/timbrados/actions";

export default async function NuevoTimbradoPage() {
    const { sucursales, proveedores } = await getTimbradoFormOptionsAction();

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <Link
                    href="/timbrados"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a timbrados
                </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Nuevo timbrado
                            </h1>

                            <p className="text-sm text-slate-500">
                                Registre un timbrado propio o de proveedor.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <TimbradoForm
                        sucursales={sucursales}
                        proveedores={proveedores}
                    />
                </div>
            </div>
        </div>
    );
}