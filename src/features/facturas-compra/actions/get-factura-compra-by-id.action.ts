"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import type {
    CreateFacturaCompraInput,
    FacturaCompraDetalleViewData,
} from "../interfaces";

function formatDateInput(date: Date | string | null) {
    if (!date) {
        return "";
    }

    const fecha = new Date(date);

    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const day = String(fecha.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function toNumber(value: unknown) {
    if (value === null || value === undefined) {
        return 0;
    }

    return Number(value);
}

export async function getFacturaCompraByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const facturaBase = await prisma.comprobante.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                empresaId: true,
                tipoMovimiento: true,
                tipoComprobante: true,
            },
        });

        if (!facturaBase) {
            return {
                ok: false,
                factura: null,
                initialData: null,
                message: "La factura de compra no existe o fue eliminada.",
            };
        }

        if (facturaBase.empresaId !== empresaId) {
            return {
                ok: false,
                factura: null,
                initialData: null,
                message:
                    "La factura existe, pero pertenece a otra empresa. Verifique la empresa activa.",
            };
        }

        if (
            facturaBase.tipoMovimiento !== "EGRESO" ||
            facturaBase.tipoComprobante !== "FACTURA"
        ) {
            return {
                ok: false,
                factura: null,
                initialData: null,
                message:
                    "El comprobante encontrado no corresponde a una factura de compra.",
            };
        }

        const factura = await prisma.comprobante.findFirst({
            where: {
                id,
                empresaId,
                tipoMovimiento: "EGRESO",
                tipoComprobante: "FACTURA",
            },
            include: {
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        tipoDocumento: true,
                        numeroDocumento: true,
                        dv: true,
                        direccion: true,
                        telefono: true,
                        email: true,
                    },
                },
                sucursal: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true,
                        direccion: true,
                        telefono: true,
                    },
                },
                timbrado: {
                    select: {
                        id: true,
                        numero: true,
                        proveedorId: true,
                        establecimiento: true,
                        puntoExpedicion: true,
                        fechaFin: true,
                    },
                },
                asiento: {
                    select: {
                        id: true,
                        numero: true,
                        origen: true,
                        estado: true,
                    },
                },
                detalles: {
                    select: {
                        id: true,
                        cuentaContableId: true,
                        descripcion: true,
                        tipoImpuesto: true,
                        cantidad: true,
                        precioUnitario: true,
                        exenta: true,
                        gravada5: true,
                        iva5: true,
                        gravada10: true,
                        iva10: true,
                        total: true,
                        cuentaContable: {
                            select: {
                                id: true,
                                codigo: true,
                                nombre: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!factura) {
            return {
                ok: false,
                factura: null,
                initialData: null,
                message: "No se pudo cargar la factura de compra.",
            };
        }

        const initialData: CreateFacturaCompraInput = {
            proveedorId: factura.proveedorId ?? "",
            sucursalId: factura.sucursalId,
            timbradoId: factura.timbradoId ?? "",

            establecimiento: factura.establecimiento ?? "",
            puntoExpedicion: factura.puntoExpedicion ?? "",
            numeroComprobante: factura.numeroComprobante ?? "",

            fechaEmision: formatDateInput(factura.fechaEmision),
            fechaVencimiento: formatDateInput(factura.fechaVencimiento),

            condicion: factura.condicion as "CONTADO" | "CREDITO",

            moneda: factura.moneda as "PYG" | "USD" | "BRL" | "ARS",
            cotizacion: toNumber(factura.cotizacion),

            concepto: factura.concepto ?? "",

            imputaIva: factura.imputaIva,
            imputaIre: factura.imputaIre,
            imputaIrpRsp: factura.imputaIrpRsp,
            noImputa: factura.noImputa,

            detalles: factura.detalles.map((detalle) => ({
                cuentaContableId: detalle.cuentaContableId ?? "",
                descripcion: detalle.descripcion ?? "",
                cantidad: toNumber(detalle.cantidad),
                precioUnitario: toNumber(detalle.precioUnitario),
                ivaTipo: detalle.tipoImpuesto as "EXENTA" | "IVA_5" | "IVA_10",
            })),
        };

        const facturaDetalle: FacturaCompraDetalleViewData = {
            id: factura.id,

            tipoMovimiento: factura.tipoMovimiento,
            tipoComprobante: factura.tipoComprobante,
            condicion: factura.condicion,
            estado: factura.estado,

            proveedorId: factura.proveedorId,
            sucursalId: factura.sucursalId,
            timbradoId: factura.timbradoId,

            numeroTimbrado: factura.numeroTimbrado,
            establecimiento: factura.establecimiento,
            puntoExpedicion: factura.puntoExpedicion,
            numeroComprobante: factura.numeroComprobante,

            fechaEmision: factura.fechaEmision,
            fechaVencimiento: factura.fechaVencimiento,

            moneda: factura.moneda,
            cotizacion: toNumber(factura.cotizacion),

            exenta: toNumber(factura.exenta),
            gravada5: toNumber(factura.gravada5),
            iva5: toNumber(factura.iva5),
            gravada10: toNumber(factura.gravada10),
            iva10: toNumber(factura.iva10),
            total: toNumber(factura.total),

            concepto: factura.concepto,

            imputaIva: factura.imputaIva,
            imputaIre: factura.imputaIre,
            imputaIrpRsp: factura.imputaIrpRsp,
            noImputa: factura.noImputa,

            proveedor: factura.proveedor,
            sucursal: factura.sucursal,
            timbrado: factura.timbrado,
            asiento: factura.asiento,

            detalles: factura.detalles.map((detalle) => ({
                id: detalle.id,
                cuentaContableId: detalle.cuentaContableId,
                descripcion: detalle.descripcion,
                tipoImpuesto: detalle.tipoImpuesto,
                cantidad: toNumber(detalle.cantidad),
                precioUnitario: toNumber(detalle.precioUnitario),
                exenta: toNumber(detalle.exenta),
                gravada5: toNumber(detalle.gravada5),
                iva5: toNumber(detalle.iva5),
                gravada10: toNumber(detalle.gravada10),
                iva10: toNumber(detalle.iva10),
                total: toNumber(detalle.total),
                cuentaContable: detalle.cuentaContable,
            })),
        };

        return {
            ok: true,
            factura: facturaDetalle,
            initialData,
            message: "Factura de compra obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener factura de compra:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                factura: null,
                initialData: null,
                message:
                    "Debe seleccionar una empresa activa para ver facturas de compra.",
            };
        }

        return {
            ok: false,
            factura: null,
            initialData: null,
            message: "No se pudo obtener la factura de compra.",
        };
    }
}