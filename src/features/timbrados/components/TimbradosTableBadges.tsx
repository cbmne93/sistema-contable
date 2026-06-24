import { getOrigenLabel } from "../helpers/timbrado-formatters.helper";
import type { Timbrado } from "../interfaces";

export function EstadoBadge({ estado }: { estado: Timbrado["estado"] }) {
    return (
        <span
            className={
                estado === "ACTIVO"
                    ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                    : "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
            }
        >
            <span
                className={
                    estado === "ACTIVO"
                        ? "mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
                        : "mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500"
                }
            />

            {estado === "ACTIVO" ? "Activo" : "Inactivo"}
        </span>
    );
}

export function OrigenBadge({ origen }: { origen: Timbrado["origen"] }) {
    return (
        <span
            className={
                origen === "PROPIO"
                    ? "rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    : "rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
            }
        >
            {getOrigenLabel(origen)}
        </span>
    );
}