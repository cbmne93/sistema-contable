import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { getFacturaVentaFormOptionsAction } from "@/features/facturas-venta/actions";
import { FacturaVentaForm } from "@/features/facturas-venta/components";

export default async function NuevaFacturaPage() {
    const {
        clientes,
        sucursales,
        timbrados,
        cuentasContables,
        empresaObligaciones,
        ok,
        message,
    } = await getFacturaVentaFormOptionsAction();

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <Link
                    href="/facturas-venta"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a facturas
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
                                Nueva factura de venta
                            </h1>

                            <p className="text-sm text-slate-500">
                                Complete los datos para registrar una factura de
                                venta.
                            </p>
                        </div>
                    </div>
                </div>

                {!ok && (
                    <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-700">
                        {message}
                    </div>
                )}

                {ok && timbrados.length === 0 && (
                    <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-700">
                        No hay timbrados propios activos disponibles para cargar
                        facturas. Primero debe cargar un timbrado propio activo
                        con numeración disponible.
                    </div>
                )}

                {ok && cuentasContables.length === 0 && (
                    <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-700">
                        No hay cuentas contables de movimiento disponibles.
                        Primero debe crear cuentas activas que acepten movimiento
                        en el Plan de cuentas.
                    </div>
                )}

                <div className="p-6">
                    <FacturaVentaForm
                        clientes={clientes}
                        sucursales={sucursales}
                        timbrados={timbrados}
                        cuentasContables={cuentasContables}
                        empresaObligaciones={empresaObligaciones}
                    />
                </div>
            </div>
        </div>
    );
}