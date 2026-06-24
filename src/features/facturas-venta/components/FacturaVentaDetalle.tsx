import Link from "next/link";
import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

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
    formatEstadoComprobante,
    formatNumeroComprobante,
    formatTipoImpuesto,
    getEstadoComprobanteBadgeClass,
    getIvaDetalle,
} from "@/features/comprobantes/helpers";

import { AnularFacturaVentaButton } from "./AnularFacturaVentaButton";

interface FacturaVentaDetalleProps {
    factura: {
        id: string;
        estado: string;
        numeroTimbrado: string | null;
        establecimiento: string | null;
        puntoExpedicion: string | null;
        numeroComprobante: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        condicion: string;
        moneda: string;
        cotizacion: number;
        exenta: number;
        gravada5: number;
        iva5: number;
        gravada10: number;
        iva10: number;
        total: number;
        concepto: string | null;
        imputaIva: boolean;
        imputaIre: boolean;
        imputaIrpRsp: boolean;
        cliente: {
            nombre: string;
            tipoDocumento: string;
            numeroDocumento: string;
            dv: string | null;
            direccion: string | null;
            telefono: string | null;
            email: string | null;
        } | null;
        sucursal: {
            nombre: string;
            codigo: string;
            direccion: string | null;
            telefono: string | null;
        };
        timbrado: {
            numero: string;
            establecimiento: string | null;
            puntoExpedicion: string | null;
            fechaFin: Date | null;
        } | null;
        asiento: {
            id: string;
            numero: number;
            origen: string;
            estado: string;
        } | null;
        detalles: {
            id: string;
            descripcion: string;
            tipoImpuesto: string;
            cantidad: number;
            precioUnitario: number;
            exenta: number;
            gravada5: number;
            iva5: number;
            gravada10: number;
            iva10: number;
            total: number;
        }[];
    };
}

function formatDocumento(factura: FacturaVentaDetalleProps["factura"]) {
    if (!factura.cliente?.numeroDocumento) {
        return "Sin documento";
    }

    return `${factura.cliente.numeroDocumento}${factura.cliente.dv ? `-${factura.cliente.dv}` : ""
        }`;
}

export function FacturaVentaDetalle({ factura }: FacturaVentaDetalleProps) {
    const isAnulada = factura.estado === "ANULADO";
    const tieneAsiento = Boolean(factura.asiento);
    const numeroFactura = formatNumeroComprobante(factura);

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link
                            href="/facturas-venta"
                            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a facturas
                        </Link>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Factura {numeroFactura}
                            </h1>

                            <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getEstadoComprobanteBadgeClass(
                                    factura.estado
                                )}`}
                            >
                                {formatEstadoComprobante(factura.estado)}
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Detalle de la factura de venta guardada.
                        </p>
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

                        {!isAnulada && !tieneAsiento && (
                            <>
                                <Link
                                    href={`/facturas-venta/${factura.id}/editar`}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </Link>

                                <AnularFacturaVentaButton
                                    facturaId={factura.id}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isAnulada && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Esta factura se encuentra anulada. Se conserva el detalle
                    para consulta, pero no debería modificarse.
                </div>
            )}

            {factura.asiento && !isAnulada && (
                <ComprobanteAsientoAlert
                    numeroAsiento={factura.asiento.numero}
                    acciones="editarla o anularla"
                />
            )}

            <div className="grid gap-4 lg:grid-cols-3">
                <ComprobanteInfoCard title="Cliente">
                    <ComprobanteField
                        label="Nombre"
                        value={factura.cliente?.nombre ?? "-"}
                    />
                    <ComprobanteField
                        label="Documento"
                        value={formatDocumento(factura)}
                    />
                    <ComprobanteField
                        label="Dirección"
                        value={factura.cliente?.direccion || "-"}
                    />
                    <ComprobanteField
                        label="Teléfono"
                        value={factura.cliente?.telefono || "-"}
                    />
                    <ComprobanteField
                        label="Correo"
                        value={factura.cliente?.email || "-"}
                    />
                </ComprobanteInfoCard>

                <ComprobanteInfoCard title="Comprobante">
                    <ComprobanteField
                        label="Nro. factura"
                        value={numeroFactura}
                    />
                    <ComprobanteField
                        label="Timbrado"
                        value={factura.numeroTimbrado ?? "-"}
                    />
                    <ComprobanteField
                        label="Fecha"
                        value={formatComprobanteDate(factura.fechaEmision)}
                    />
                    <ComprobanteField
                        label="Condición"
                        value={formatCondicionComprobante(factura.condicion)}
                    />
                    <ComprobanteField
                        label="Estado"
                        value={formatEstadoComprobante(factura.estado)}
                    />
                </ComprobanteInfoCard>

                <ComprobanteInfoCard title="Moneda">
                    <ComprobanteField label="Moneda" value={factura.moneda} />
                    <ComprobanteField
                        label="Cotización"
                        value={factura.cotizacion}
                    />
                    <ComprobanteField
                        label="Vencimiento"
                        value={formatComprobanteDate(factura.fechaVencimiento)}
                    />
                    <ComprobanteField
                        label="Sucursal"
                        value={factura.sucursal.nombre}
                    />
                </ComprobanteInfoCard>
            </div>

            <ComprobanteImputacionResumen
                imputaIva={factura.imputaIva}
                imputaIre={factura.imputaIre}
                imputaIrpRsp={factura.imputaIrpRsp}
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
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <h2 className="text-sm font-semibold text-slate-800">
                        Detalles
                    </h2>

                    <span className="text-xs text-slate-500">
                        {factura.detalles.length} ítem
                        {factura.detalles.length === 1 ? "" : "s"}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-190 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="w-40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Impuesto
                                </th>

                                <th className="w-44 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Importe
                                </th>

                                <th className="w-44 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    IVA
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Descripción
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {factura.detalles.map((detalle) => (
                                <tr
                                    key={detalle.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 text-slate-700">
                                        {formatTipoImpuesto(
                                            detalle.tipoImpuesto
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                                        {formatComprobanteCurrency(
                                            detalle.precioUnitario,
                                            factura.moneda
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {formatComprobanteCurrency(
                                            getIvaDetalle(detalle),
                                            factura.moneda
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-slate-700">
                                        {detalle.descripcion || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ComprobanteTotalesCard
                moneda={factura.moneda}
                exenta={factura.exenta}
                gravada5={factura.gravada5}
                iva5={factura.iva5}
                gravada10={factura.gravada10}
                iva10={factura.iva10}
                total={factura.total}
                className="ml-auto max-w-md"
            />
        </div>
    );
}