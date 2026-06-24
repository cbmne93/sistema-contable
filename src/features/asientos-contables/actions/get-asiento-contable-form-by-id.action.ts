"use server";

import { OrigenAsientoContable } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import type { AsientoContableFormValues } from "../validations";

function toDateInputValue(value: Date) {
    return value.toISOString().slice(0, 10);
}

function toNumber(value: unknown) {
    return Number(value || 0);
}

export async function getAsientoContableFormByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const asiento = await prisma.asientoContable.findFirst({
            where: {
                id,
                empresaId,
                origen: OrigenAsientoContable.MANUAL,
            },
            select: {
                id: true,
                fecha: true,
                concepto: true,
                sucursalId: true,
                estado: true,
                detalles: {
                    select: {
                        cuentaContableId: true,
                        descripcion: true,
                        debe: true,
                        haber: true,
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
                message: "No se encontró el asiento manual.",
            };
        }

        const data: AsientoContableFormValues = {
            fecha: toDateInputValue(asiento.fecha),
            concepto: asiento.concepto,
            sucursalId: asiento.sucursalId ?? "",
            detalles: asiento.detalles.map((detalle) => ({
                cuentaContableId: detalle.cuentaContableId,
                descripcion: detalle.descripcion ?? "",
                debe: toNumber(detalle.debe),
                haber: toNumber(detalle.haber),
            })),
        };

        return {
            ok: true,
            asiento: data,
            message: "Asiento obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener asiento manual:", error);

        return {
            ok: false,
            asiento: null,
            message: "No se pudo obtener el asiento manual.",
        };
    }
}