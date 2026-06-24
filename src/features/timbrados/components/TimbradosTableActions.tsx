import Link from "next/link";
import { Pencil } from "lucide-react";

import type { Timbrado } from "../interfaces";
import { DeleteTimbradoButton } from "./DeleteTimbradoButton";

interface TimbradosTableActionsProps {
    timbrado: Timbrado;
}

export function TimbradosTableActions({
    timbrado,
}: TimbradosTableActionsProps) {
    return (
        <div className="flex justify-end gap-2 whitespace-nowrap">
            <Link
                href={`/timbrados/${timbrado.id}/editar`}
                title="Editar timbrado"
                aria-label="Editar timbrado"
                className="inline-flex h-9 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
                <Pencil className="h-4 w-4" />
            </Link>

            <DeleteTimbradoButton
                timbradoId={timbrado.id}
                tieneMovimientos={timbrado.tieneMovimientos}
                estado={timbrado.estado}
            />
        </div>
    );
}