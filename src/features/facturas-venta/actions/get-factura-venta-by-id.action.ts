"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { TipoComprobante, TipoMovimiento } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function getFacturaVentaByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const factura = await prisma.comprobante.findFirst({
            where: {
                id,
                empresaId,
                tipoMovimiento: TipoMovimiento.INGRESO,
                tipoComprobante: TipoComprobante.FACTURA,
            },
            include: {
                cliente: {
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
                        nombre: true,
                        codigo: true,
                        direccion: true,
                        telefono: true,
                    },
                },
                timbrado: {
                    select: {
                        id: true,
                        numero: true,
                        establecimiento: true,
                        puntoExpedicion: true,
                        numeroDesde: true,
                        numeroHasta: true,
                        numeroActual: true,
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
                message: "No se encontró la factura de venta.",
            };
        }

        const facturaSerializada = {
            ...factura,
            cotizacion: Number(factura.cotizacion),
            exenta: Number(factura.exenta),
            gravada5: Number(factura.gravada5),
            iva5: Number(factura.iva5),
            gravada10: Number(factura.gravada10),
            iva10: Number(factura.iva10),
            total: Number(factura.total),
            detalles: factura.detalles.map((detalle) => ({
                ...detalle,
                cantidad: Number(detalle.cantidad),
                precioUnitario: Number(detalle.precioUnitario),
                exenta: Number(detalle.exenta),
                gravada5: Number(detalle.gravada5),
                iva5: Number(detalle.iva5),
                gravada10: Number(detalle.gravada10),
                iva10: Number(detalle.iva10),
                total: Number(detalle.total),
            })),
        };

        return {
            ok: true,
            factura: facturaSerializada,
            message: "Factura obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener factura de venta:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                factura: null,
                message:
                    "Debe seleccionar una empresa activa para ver facturas.",
            };
        }

        return {
            ok: false,
            factura: null,
            message: "No se pudo obtener la factura de venta.",
        };
    }
}