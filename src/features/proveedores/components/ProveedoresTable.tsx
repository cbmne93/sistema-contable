
import Link from "next/link";
import { Pencil, Truck } from "lucide-react";

import type { Proveedor } from "../interfaces";
import { DeleteProveedorButton } from "./DeleteProveedorButton";

interface ProveedoresTableProps {
    proveedores: Proveedor[];
}

function getTipoDocumentoLabel(tipoDocumento: Proveedor["tipoDocumento"]) {
    const labels: Record<Proveedor["tipoDocumento"], string> = {
        RUC: "RUC",
        CEDULA_IDENTIDAD: "Cédula",
        PASAPORTE: "Pasaporte",
        DOCUMENTO_EXTRANJERO: "Doc. extranjero",
    };

    return labels[tipoDocumento];
}

function getTipoPersonaLabel(tipoPersona: Proveedor["tipoPersona"]) {
    const labels: Record<Proveedor["tipoPersona"], string> = {
        FISICA: "Física",
        JURIDICA: "Jurídica",
    };

    return labels[tipoPersona];
}

export function ProveedoresTable({ proveedores }: ProveedoresTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Proveedor
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Documento
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Tipo persona
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Estado
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {proveedores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-12">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <Truck className="h-6 w-6 text-slate-400" />
                                        </div>

                                        <p className="text-sm font-medium text-slate-700">
                                            No hay proveedores registrados
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Cree un nuevo proveedor para comenzar a operar.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            proveedores.map((proveedor) => (
                                <tr
                                    key={proveedor.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <Truck className="h-5 w-5 text-slate-500" />
                                            </div>

                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {proveedor.nombre}
                                                </p>

                                                {proveedor.email && (
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {proveedor.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="font-medium text-slate-700">
                                                {proveedor.numeroDocumento}
                                                {proveedor.dv ? `-${proveedor.dv}` : ""}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {getTipoDocumentoLabel(proveedor.tipoDocumento)}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {getTipoPersonaLabel(proveedor.tipoPersona)}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={
                                                proveedor.estado === "ACTIVO"
                                                    ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                                    : "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                                            }
                                        >
                                            <span
                                                className={
                                                    proveedor.estado === "ACTIVO"
                                                        ? "mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
                                                        : "mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500"
                                                }
                                            />
                                            {proveedor.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Link
                                                href={`/proveedores/${proveedor.id}/editar`}
                                                className="inline-flex h-9 min-w-28 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Editar
                                            </Link>

                                            <DeleteProveedorButton
                                                proveedorId={proveedor.id}
                                                proveedorNombre={proveedor.nombre}
                                                tieneMovimientos={proveedor.tieneMovimientos}
                                                estado={proveedor.estado}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}