import Link from "next/link";
import { Eye } from "lucide-react";

import { AnularMarangatuRegistroButton } from "./AnularMarangatuRegistroButton";
import { DeleteMarangatuRegistroButton } from "./DeleteMarangatuRegistroButton";

interface MarangatuRegistrosTableProps {
    registros: {
        id: string;
        codigo: string;
        version: number;
        anio: number;
        mes: number;
        tipoInforme: string;
        estado: string;
        registrosCompra: number;
        registrosVenta: number;
        registrosEgreso: number;
        registrosIngreso: number;
        fechaGeneracion: string;
        fechaAnulacion: string | null;
    }[];
}

const MONTH_LABELS = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatTipoInforme(value: string) {
    if (value === "TODOS") return "Todos";
    if (value === "COMPRAS") return "Compras";
    if (value === "VENTAS") return "Ventas";
    if (value === "EGRESOS") return "Egresos";
    if (value === "INGRESOS") return "Ingresos";

    return value;
}

export function MarangatuRegistrosTable({
    registros,
}: MarangatuRegistrosTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Versiones generadas
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-212.5 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Código
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Periodo
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Tipo
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600">
                                Compras
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600">
                                Ventas
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-600">
                                Estado
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Generado
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {registros.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-10 text-center text-slate-500"
                                >
                                    Todavía no hay registros generados.
                                </td>
                            </tr>
                        ) : (
                            registros.map((registro) => {
                                const isAnulado =
                                    registro.estado === "ANULADO";

                                return (
                                    <tr
                                        key={registro.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-slate-900">
                                                {registro.codigo}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Versión{" "}
                                                {String(
                                                    registro.version
                                                ).padStart(3, "0")}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3 text-slate-700">
                                            {MONTH_LABELS[registro.mes]}{" "}
                                            {registro.anio}
                                        </td>

                                        <td className="px-4 py-3 text-slate-700">
                                            {formatTipoInforme(
                                                registro.tipoInforme
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center text-slate-700">
                                            {registro.registrosCompra}
                                        </td>

                                        <td className="px-4 py-3 text-center text-slate-700">
                                            {registro.registrosVenta}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={
                                                    isAnulado
                                                        ? "inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"
                                                        : "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                                }
                                            >
                                                {isAnulado
                                                    ? "Anulado"
                                                    : "Generado"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-slate-700">
                                            {formatDate(
                                                registro.fechaGeneracion
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/reportes/marangatu/${registro.id}`}
                                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    Ver
                                                </Link>

                                                {isAnulado ? (
                                                    <DeleteMarangatuRegistroButton
                                                        id={registro.id}
                                                        codigo={registro.codigo}
                                                    />
                                                ) : (
                                                    <AnularMarangatuRegistroButton
                                                        id={registro.id}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}