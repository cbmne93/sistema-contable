import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import {
    getTimbradoByIdAction,
    getTimbradoFormOptionsAction,
} from "@/features/timbrados/actions";
import { TimbradoForm } from "@/features/timbrados/components";

interface EditarTimbradoPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarTimbradoPage({
    params,
}: EditarTimbradoPageProps) {
    const { id } = await params;

    const [timbradoResult, optionsResult] = await Promise.all([
        getTimbradoByIdAction(id),
        getTimbradoFormOptionsAction(),
    ]);

    if (!timbradoResult.ok || !timbradoResult.timbrado) {
        notFound();
    }

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
                                Editar timbrado
                            </h1>

                            <p className="text-sm text-slate-500">
                                Actualice los datos del timbrado seleccionado.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <TimbradoForm
                        timbrado={timbradoResult.timbrado}
                        sucursales={optionsResult.sucursales}
                        proveedores={optionsResult.proveedores}
                    />
                </div>
            </div>
        </div>
    );
}