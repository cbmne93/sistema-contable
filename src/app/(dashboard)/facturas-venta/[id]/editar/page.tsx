import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import {
    getFacturaVentaByIdAction,
    getFacturaVentaFormOptionsAction,
} from "@/features/facturas-venta/actions";
import { FacturaVentaForm } from "@/features/facturas-venta/components";
import type { FacturaVentaFormValues } from "@/features/facturas-venta/validations";

interface EditarFacturaVentaPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatDateInputValue(date: Date | string | null) {
    if (!date) {
        return "";
    }

    return new Date(date).toISOString().slice(0, 10);
}

function mapFacturaToFormValues(
    factura: NonNullable<
        Awaited<ReturnType<typeof getFacturaVentaByIdAction>>["factura"]
    >
): FacturaVentaFormValues {
    return {
        clienteId: factura.clienteId ?? "",
        sucursalId: factura.sucursalId,
        timbradoId: factura.timbradoId ?? "",
        numeroComprobante: factura.numeroComprobante,

        fechaEmision: formatDateInputValue(factura.fechaEmision),
        fechaVencimiento: formatDateInputValue(factura.fechaVencimiento),

        condicion: factura.condicion,
        moneda: factura.moneda as "PYG" | "USD" | "BRL" | "ARS",
        cotizacion: factura.cotizacion,

        concepto: factura.concepto ?? "",

        imputaIva: factura.imputaIva,
        imputaIre: factura.imputaIre,
        imputaIrpRsp: factura.imputaIrpRsp,

        detalles: factura.detalles.map((detalle) => ({
            cuentaContableId: detalle.cuentaContableId ?? "",
            descripcion: detalle.descripcion ?? "",
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            ivaTipo: detalle.tipoImpuesto as "EXENTA" | "IVA_5" | "IVA_10",
        })),
    };
}

export default async function EditarFacturaVentaPage({
    params,
}: EditarFacturaVentaPageProps) {
    const { id } = await params;

    const [facturaResponse, optionsResponse] = await Promise.all([
        getFacturaVentaByIdAction(id),
        getFacturaVentaFormOptionsAction(),
    ]);

    if (!facturaResponse.ok || !facturaResponse.factura) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    href="/facturas-venta"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a facturas
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    {facturaResponse.message}
                </div>
            </div>
        );
    }

    if (!optionsResponse.ok) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    href={`/facturas-venta/${facturaResponse.factura.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al detalle
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                    {optionsResponse.message}
                </div>
            </div>
        );
    }

    const factura = facturaResponse.factura;

    if (factura.estado === "ANULADO") {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <Link
                    href={`/facturas-venta/${factura.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al detalle
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h1 className="text-lg font-semibold text-red-800">
                        No se puede editar una factura anulada
                    </h1>

                    <p className="mt-1 text-sm text-red-700">
                        Esta factura ya fue anulada. Se conserva solo para
                        consulta.
                    </p>
                </div>
            </div>
        );
    }

    const initialValues = mapFacturaToFormValues(factura);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <Link
                    href={`/facturas-venta/${factura.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al detalle
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
                                Editar factura de venta
                            </h1>

                            <p className="text-sm text-slate-500">
                                Corrija los datos cargados de una factura ya
                                emitida.
                            </p>
                        </div>
                    </div>
                </div>

                {optionsResponse.cuentasContables.length === 0 && (
                    <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-700">
                        No hay cuentas contables de movimiento disponibles.
                        Primero debe crear cuentas activas que acepten movimiento
                        en el Plan de cuentas.
                    </div>
                )}

                <div className="p-6">
                    <FacturaVentaForm
                        clientes={optionsResponse.clientes}
                        sucursales={optionsResponse.sucursales}
                        timbrados={optionsResponse.timbrados}
                        cuentasContables={optionsResponse.cuentasContables}
                        empresaObligaciones={
                            optionsResponse.empresaObligaciones
                        }
                        facturaId={factura.id}
                        initialValues={initialValues}
                    />
                </div>
            </div>
        </div>
    );
}