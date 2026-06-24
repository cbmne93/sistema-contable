import Link from "next/link";
import {
    BookOpen,
    CheckCircle2,
    CircleSlash,
    Edit,
    Layers3,
} from "lucide-react";

import type { CuentaContable } from "../interfaces";

import { DeleteCuentaContableButton } from "./DeleteCuentaContableButton";
import { ToggleCuentaContableEstadoButton } from "./ToggleCuentaContableEstadoButton";

interface PlanCuentasTableProps {
    cuentas: CuentaContable[];
}

function getTipoLabel(tipo: string) {
    const labels: Record<string, string> = {
        ACTIVO: "Activo",
        PASIVO: "Pasivo",
        PATRIMONIO: "Patrimonio",
        INGRESO: "Ingreso",
        EGRESO: "Egreso",
    };

    return labels[tipo] ?? tipo;
}

function getNaturalezaLabel(naturaleza: string) {
    const labels: Record<string, string> = {
        DEUDORA: "Deudora",
        ACREEDORA: "Acreedora",
    };

    return labels[naturaleza] ?? naturaleza;
}

function getMonedaLabel(moneda: string) {
    const labels: Record<string, string> = {
        LOCAL: "Local",
        EXTRANJERA: "Extranjera",
    };

    return labels[moneda] ?? moneda;
}

function getEstadoClassName(estado: string) {
    if (estado === "ACTIVO") {
        return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700";
    }

    return "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600";
}

function puedeEditarCuenta(cuenta: CuentaContable) {
    return cuenta.codigo.length > 2 && cuenta.nivel > 2;
}

export function PlanCuentasTable({ cuentas }: PlanCuentasTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-262.5 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Código
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Cuenta
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Tipo
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Naturaleza
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nivel
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Movimiento
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Moneda
                            </th>

                            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Estado
                            </th>

                            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {cuentas.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-12">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <BookOpen className="h-6 w-6 text-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-700">
                                            No hay cuentas contables registradas
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Cargue o importe un plan de cuentas
                                            para comenzar.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            cuentas.map((cuenta) => {
                                const puedeEditar = puedeEditarCuenta(cuenta);
                                const puedeEliminar = puedeEditar;
                                const puedeCambiarEstado = puedeEditar;

                                return (
                                    <tr
                                        key={cuenta.id}
                                        className="transition-colors hover:bg-slate-50/80"
                                    >
                                        <td className="px-3 py-3">
                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                {cuenta.codigo}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <Layers3 className="h-3.5 w-3.5 text-slate-500" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900">
                                                        {cuenta.nombre}
                                                    </p>

                                                    {cuenta.cuentaPadre && (
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            Padre:{" "}
                                                            {
                                                                cuenta
                                                                    .cuentaPadre
                                                                    .codigo
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                cuenta
                                                                    .cuentaPadre
                                                                    .nombre
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {getTipoLabel(cuenta.tipo)}
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {getNaturalezaLabel(
                                                cuenta.naturaleza
                                            )}
                                        </td>

                                        <td className="px-3 py-3 text-center text-slate-700">
                                            {cuenta.nivel}
                                        </td>

                                        <td className="px-3 py-3 text-center">
                                            {cuenta.aceptaMovimiento ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                    <CircleSlash className="h-3 w-3" />
                                                    No
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-3 py-3 text-slate-700">
                                            {getMonedaLabel(cuenta.moneda)}
                                        </td>

                                        <td className="px-3 py-3">
                                            <span
                                                className={getEstadoClassName(
                                                    cuenta.estado
                                                )}
                                            >
                                                {cuenta.estado === "ACTIVO"
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {puedeEditar ? (
                                                    <Link
                                                        href={`/plan-cuentas/${cuenta.id}/editar`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                                        title="Editar cuenta"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 text-slate-300"
                                                        title="Cuenta principal no editable"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {puedeEliminar && (
                                                    <DeleteCuentaContableButton
                                                        cuentaId={cuenta.id}
                                                        cuentaCodigo={
                                                            cuenta.codigo
                                                        }
                                                        cuentaNombre={
                                                            cuenta.nombre
                                                        }
                                                    />
                                                )}

                                                {puedeCambiarEstado && (
                                                    <ToggleCuentaContableEstadoButton
                                                        cuentaId={cuenta.id}
                                                        cuentaCodigo={
                                                            cuenta.codigo
                                                        }
                                                        cuentaNombre={
                                                            cuenta.nombre
                                                        }
                                                        estado={cuenta.estado}
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