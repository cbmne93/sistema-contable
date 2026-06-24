import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    Building2,
    FileText,
    Pencil,
    ReceiptText,
} from "lucide-react";

import {
    ComprobanteAsientoAlert,
    ComprobanteField,
    ComprobanteImputacionResumen,
    ComprobanteInfoCard,
    ComprobanteTotalesCard,
} from "@/features/comprobantes/components";

import {
    formatComprobanteCurrency,
    formatComprobanteDate,
    formatCondicionComprobante,
    formatNumeroComprobante,
    formatTipoImpuesto,
    getIvaDetalle,
} from "@/features/comprobantes/helpers";

import type { FacturaCompraDetalleViewData } from "../interfaces";

import { DeleteFacturaCompraButton } from "./DeleteFacturaCompraButton";

interface FacturaCompraDetalleProps {
    factura: FacturaCompraDetalleViewData;
}

function formatDocumento(factura: FacturaCompraDetalleViewData) {
    if (!factura.proveedor?.numeroDocumento) {
        return "Sin documento";
    }

    return `${factura.proveedor.numeroDocumento}${factura.proveedor.dv ? `-${factura.proveedor.dv}` : ""
        }`;
}

export function FacturaCompraDetalle({ factura }: FacturaCompraDetalleProps) {
    const numeroFactura = formatNumeroComprobante(factura);
    const tieneAsiento = Boolean(factura.asiento);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Link
                        href="/facturas-compra"
                        className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a facturas de compra
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <ReceiptText className="h-5 w-5" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Factura de compra {numeroFactura}
                            </h1>

                            <p className="text-sm text-slate-500">
                                Detalle de la factura de compra registrada.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                    {factura.asiento && (
                        <Link
                            href={`/asientos-contables/${factura.asiento.id}`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <BookOpen className="h-4 w-4" />
                            Ver asiento N° {factura.asiento.numero}
                        </Link>
                    )}

                    {!tieneAsiento && (
                        <>
                            <Link
                                href={`/facturas-compra/${factura.id}/editar`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Link>

                            <DeleteFacturaCompraButton
                                facturaId={factura.id}
                                numeroFactura={numeroFactura}
                                redirectTo="/facturas-compra"
                                variant="button"
                                label="Eliminar"
                            />
                        </>
                    )}
                </div>
            </div>

            {factura.asiento && (
                <ComprobanteAsientoAlert
                    numeroAsiento={factura.asiento.numero}
                    acciones="editarla o eliminarla"
                />
            )}

            <div className="grid gap-4 lg:grid-cols-3">
                <ComprobanteInfoCard
                    title="Proveedor"
                    icon={<Building2 className="h-4 w-4 text-slate-600" />}
                >
                    <ComprobanteField
                        label="Nombre"
                        value={factura.proveedor?.nombre ?? "-"}
                    />
                    <ComprobanteField
                        label="Documento"
                        value={formatDocumento(factura)}
                    />
                    <ComprobanteField
                        label="Dirección"
                        value={factura.proveedor?.direccion || "-"}
                    />
                    <ComprobanteField
                        label="Teléfono"
                        value={factura.proveedor?.telefono || "-"}
                    />
                    <ComprobanteField
                        label="Correo"
                        value={factura.proveedor?.email || "-"}
                    />
                </ComprobanteInfoCard>

                <ComprobanteInfoCard
                    title="Comprobante"
                    icon={<FileText className="h-4 w-4 text-slate-600" />}
                >
                    <ComprobanteField
                        label="Nro. factura"
                        value={numeroFactura}
                    />
                    <ComprobanteField
                        label="Timbrado"
                        value={factura.numeroTimbrado ?? "-"}
                    />
                    <ComprobanteField
                        label="Fecha emisión"
                        value={formatComprobanteDate(factura.fechaEmision)}
                    />
                    <ComprobanteField
                        label="Vencimiento"
                        value={formatComprobanteDate(factura.fechaVencimiento)}
                    />
                    <ComprobanteField
                        label="Condición"
                        value={formatCondicionComprobante(factura.condicion)}
                    />
                </ComprobanteInfoCard>

                <ComprobanteTotalesCard
                    moneda={factura.moneda}
                    exenta={factura.exenta}
                    gravada5={factura.gravada5}
                    iva5={factura.iva5}
                    gravada10={factura.gravada10}
                    iva10={factura.iva10}
                    total={factura.total}
                    className="bg-white p-5 shadow-sm"
                />
            </div>

            <ComprobanteImputacionResumen
                imputaIva={factura.imputaIva}
                imputaIre={factura.imputaIre}
                imputaIrpRsp={factura.imputaIrpRsp}
                noImputa={factura.noImputa}
                mostrarNoImputa
            />

            {factura.concepto && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Concepto
                    </h2>

                    <p className="text-sm text-slate-700">
                        {factura.concepto}
                    </p>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Detalle de la factura
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Ítems cargados en la factura de compra.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-250 text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Cuenta
                                </th>

                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Descripción
                                </th>

                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Impuesto
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Cant.
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Precio
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    IVA
                                </th>

                                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {factura.detalles.map((detalle) => (
                                <tr
                                    key={detalle.id}
                                    className="transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-3 py-3">
                                        {detalle.cuentaContable ? (
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {
                                                        detalle.cuentaContable
                                                            .codigo
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {
                                                        detalle.cuentaContable
                                                            .nombre
                                                    }
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">
                                                Sin cuenta
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-3 py-3 text-slate-700">
                                        {detalle.descripcion || "-"}
                                    </td>

                                    <td className="px-3 py-3 text-slate-700">
                                        {formatTipoImpuesto(
                                            detalle.tipoImpuesto
                                        )}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {detalle.cantidad}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatComprobanteCurrency(
                                            detalle.precioUnitario,
                                            factura.moneda
                                        )}
                                    </td>

                                    <td className="px-3 py-3 text-right text-slate-700">
                                        {formatComprobanteCurrency(
                                            getIvaDetalle(detalle),
                                            factura.moneda
                                        )}
                                    </td>

                                    <td className="px-3 py-3 text-right font-semibold text-slate-900">
                                        {formatComprobanteCurrency(
                                            detalle.total,
                                            factura.moneda
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="border-t border-slate-200 bg-slate-50">
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-3 py-3 text-right text-sm font-semibold text-slate-700"
                                >
                                    Total factura
                                </td>

                                <td className="px-3 py-3 text-right text-sm font-bold text-slate-900">
                                    {formatComprobanteCurrency(
                                        factura.total,
                                        factura.moneda
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}