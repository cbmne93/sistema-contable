import Link from "next/link";
import { Contact, Pencil } from "lucide-react";

import type { Cliente } from "../interfaces";
import { DeleteClienteButton } from "./DeleteClienteButton";

interface ClientesTableProps {
    clientes: Cliente[];
}

function getTipoDocumentoLabel(tipoDocumento: Cliente["tipoDocumento"]) {
    const labels: Record<Cliente["tipoDocumento"], string> = {
        RUC: "RUC",
        CEDULA_IDENTIDAD: "Cédula",
        PASAPORTE: "Pasaporte",
        DOCUMENTO_EXTRANJERO: "Doc. extranjero",
    };

    return labels[tipoDocumento];
}

function getTipoPersonaLabel(tipoPersona: Cliente["tipoPersona"]) {
    const labels: Record<Cliente["tipoPersona"], string> = {
        FISICA: "Física",
        JURIDICA: "Jurídica",
    };

    return labels[tipoPersona];
}

export function ClientesTable({ clientes }: ClientesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
                <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Cliente
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
                    {clientes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-5 py-12">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <Contact className="h-6 w-6 text-slate-400" />
                                    </div>

                                    <p className="text-sm font-medium text-slate-700">
                                        No hay clientes registrados
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Cree un nuevo cliente para comenzar a operar.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        clientes.map((cliente) => (
                            <tr
                                key={cliente.id}
                                className="transition-colors hover:bg-slate-50/80"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                            <Contact className="h-5 w-5 text-slate-500" />
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {cliente.nombre}
                                            </p>

                                            {cliente.email && (
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {cliente.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-medium text-slate-700">
                                            {cliente.numeroDocumento}
                                            {cliente.dv ? `-${cliente.dv}` : ""}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {getTipoDocumentoLabel(cliente.tipoDocumento)}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {getTipoPersonaLabel(cliente.tipoPersona)}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <span
                                        className={
                                            cliente.estado === "ACTIVO"
                                                ? "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                                : "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                                        }
                                    >
                                        <span
                                            className={
                                                cliente.estado === "ACTIVO"
                                                    ? "mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
                                                    : "mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500"
                                            }
                                        />
                                        {cliente.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Link
                                            href={`/clientes/${cliente.id}/editar`}
                                            className="inline-flex h-9 min-w-28 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </Link>

                                        <DeleteClienteButton
                                            clienteId={cliente.id}
                                            clienteNombre={cliente.nombre}
                                            tieneMovimientos={cliente.tieneMovimientos}
                                            estado={cliente.estado}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}