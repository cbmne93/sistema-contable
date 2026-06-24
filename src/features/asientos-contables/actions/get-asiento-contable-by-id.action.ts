"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import type { AsientoContableDetalle } from "../interfaces";

function toNumber(value: unknown) {
    if (value === null || value === undefined) {
        return 0;
    }

    return Number(value);
}

function toDateString(value: Date) {
    return value.toISOString();
}

export async function getAsientoContableByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const asiento = await prisma.asientoContable.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                numero: true,
                fecha: true,
                concepto: true,
                origen: true,
                estado: true,
                totalDebe: true,
                totalHaber: true,

                sucursal: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },

                comprobante: {
                    select: {
                        id: true,
                        tipoMovimiento: true,
                        tipoComprobante: true,
                        numeroComprobante: true,
                        establecimiento: true,
                        puntoExpedicion: true,
                    },
                },

                detalles: {
                    select: {
                        id: true,
                        descripcion: true,
                        debe: true,
                        haber: true,
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

        if (!asiento) {
            return {
                ok: false,
                asiento: null,
                message: "No se encontró el asiento contable.",
            };
        }

        const data: AsientoContableDetalle = {
            id: asiento.id,
            numero: asiento.numero,
            fecha: toDateString(asiento.fecha),
            concepto: asiento.concepto,
            origen: asiento.origen,
            estado: asiento.estado,
            totalDebe: toNumber(asiento.totalDebe),
            totalHaber: toNumber(asiento.totalHaber),
            sucursal: asiento.sucursal,
            comprobante: asiento.comprobante,
            detalles: asiento.detalles.map((detalle) => ({
                id: detalle.id,
                descripcion: detalle.descripcion,
                debe: toNumber(detalle.debe),
                haber: toNumber(detalle.haber),
                cuentaContable: detalle.cuentaContable,
            })),
        };

        return {
            ok: true,
            asiento: data,
            message: "Asiento contable obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener asiento contable:", error);

        return {
            ok: false,
            asiento: null,
            message: "No se pudo obtener el asiento contable.",
        };
    }
}