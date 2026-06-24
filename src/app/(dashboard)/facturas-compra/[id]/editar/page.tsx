import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import {
    getFacturaCompraByIdAction,
    getFacturaCompraFormOptionsAction,
} from "@/features/facturas-compra/actions";
import { FacturaCompraForm } from "@/features/facturas-compra/components";

interface EditarFacturaCompraPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatNumeroFactura(factura: {
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroComprobante: string | null;
}) {
    const establecimiento = factura.establecimiento ?? "---";
    const puntoExpedicion = factura.puntoExpedicion ?? "---";
    const numeroComprobante = factura.numeroComprobante ?? "-------";

    return `${establecimiento}-${puntoExpedicion}-${numeroComprobante}`;
}

export default async function EditarFacturaCompraPage({
    params,
}: EditarFacturaCompraPageProps) {
    const { id } = await params;

    const [facturaResponse, optionsResponse] = await Promise.all([
        getFacturaCompraByIdAction(id),
        getFacturaCompraFormOptionsAction(),
    ]);

    if (!facturaResponse.ok || !facturaResponse.initialData) {
        return (
            <div className="space-y-4">
                <Link
                    href="/facturas-compra"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a facturas de compra
                </Link>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                    <p className="font-semibold">
                        No se pudo abrir la factura de compra.
                    </p>

                    <p className="mt-1">{facturaResponse.message}</p>
                </div>
            </div>
        );
    }

    if (!optionsResponse.ok) {
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
                    {optionsResponse.message}
                </div>
            </div>
        );
    }

    const numeroFactura = facturaResponse.factura
        ? formatNumeroFactura(facturaResponse.factura)
        : "";

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
                                Editar factura de compra
                            </h1>

                            <p className="text-sm text-slate-500">
                                Actualice los datos de la factura {numeroFactura}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <FacturaCompraForm
                proveedores={optionsResponse.proveedores}
                sucursales={optionsResponse.sucursales}
                timbrados={optionsResponse.timbrados}
                cuentasContables={optionsResponse.cuentasContables}
                empresaObligaciones={optionsResponse.empresaObligaciones}
                facturaId={id}
                initialData={facturaResponse.initialData}
            />
        </div>
    );
}