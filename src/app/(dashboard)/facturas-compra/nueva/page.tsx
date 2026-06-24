import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import { getFacturaCompraFormOptionsAction } from "@/features/facturas-compra/actions";
import { FacturaCompraForm } from "@/features/facturas-compra/components";

export default async function NuevaFacturaCompraPage() {
    const {
        ok,
        proveedores,
        sucursales,
        timbrados,
        cuentasContables,
        empresaObligaciones,
        message,
    } = await getFacturaCompraFormOptionsAction();

    if (!ok) {
        return (
            <div className="space-y-4">
                <Link
                    href="/facturas-compra"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {message}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Link
                        href="/facturas-compra"
                        className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <ReceiptText className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Nueva factura de compra
                            </h1>
                            <p className="text-sm text-slate-500">
                                Registre una factura recibida de un proveedor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <FacturaCompraForm
                proveedores={proveedores}
                sucursales={sucursales}
                timbrados={timbrados}
                cuentasContables={cuentasContables}
                empresaObligaciones={empresaObligaciones}
            />
        </div>
    );
}