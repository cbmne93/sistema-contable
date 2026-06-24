import { FileSpreadsheet } from "lucide-react";

import { getMarangatuRegistrosAction } from "@/features/reportes/marangatu/actions";
import {
    MarangatuGenerarForm,
    MarangatuRegistrosTable,
} from "@/features/reportes/marangatu/components";

export default async function MarangatuPage() {
    const response = await getMarangatuRegistrosAction();

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <FileSpreadsheet className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Registro de comprobantes - DNIT
                        </h1>

                        <p className="text-sm text-slate-500">
                            Genere versiones para importar comprobantes en
                            Marangatu.
                        </p>
                    </div>
                </div>
            </div>

            {!response.ok && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    {response.message}
                </div>
            )}

            <MarangatuGenerarForm />

            <MarangatuRegistrosTable registros={response.registros} />
        </div>
    );
}