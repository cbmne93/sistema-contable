"use server";

import { revalidatePath } from "next/cache";

import {
    EstadoRegistro,
    OrigenAsientoContable,
} from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

import {
    asientoContableSchema,
    type AsientoContableFormValues,
} from "../validations";

function toDate(value: string) {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

function toNumber(value: unknown) {
    return Number(value || 0);
}

export async function updateAsientoContableAction(
    id: string,
    values: AsientoContableFormValues
) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const parsed = asientoContableSchema.safeParse(values);

        if (!parsed.success) {
            return {
                ok: false,
                message:
                    parsed.error.issues[0]?.message ??
                    "Verifique los datos del asiento contable.",
            };
        }

        const data = parsed.data;

        const asientoActual = await prisma.asientoContable.findFirst({
            where: {
                id,
                empresaId,
                periodoFiscalId: periodoFiscal.id,
            },
            select: {
                id: true,
                origen: true,
                estado: true,
                comprobanteId: true,
            },
        });

        if (!asientoActual) {
            return {
                ok: false,
                message: "No se encontró el asiento contable.",
            };
        }

        if (asientoActual.origen !== OrigenAsientoContable.MANUAL) {
            return {
                ok: false,
                message:
                    "Solo se pueden editar los asientos manuales. Los automáticos se corrigen desde el comprobante.",
            };
        }

        if (asientoActual.comprobanteId) {
            return {
                ok: false,
                message:
                    "No se puede editar un asiento relacionado a un comprobante.",
            };
        }

        const fecha = toDate(data.fecha);

        if (!fecha) {
            return {
                ok: false,
                message: "La fecha del asiento no es válida.",
            };
        }

        if (fecha < periodoFiscal.fechaInicio || fecha > periodoFiscal.fechaFin) {
            return {
                ok: false,
                message:
                    "La fecha del asiento debe estar dentro del periodo fiscal activo.",
            };
        }

        const cuentaIds = data.detalles.map(
            (detalle) => detalle.cuentaContableId
        );

        const cuentas = await prisma.cuentaContable.findMany({
            where: {
                id: {
                    in: cuentaIds,
                },
                empresaId,
                estado: EstadoRegistro.ACTIVO,
                aceptaMovimiento: true,
            },
            select: {
                id: true,
            },
        });

        if (cuentas.length !== new Set(cuentaIds).size) {
            return {
                ok: false,
                message:
                    "Una o más cuentas seleccionadas no están activas o no aceptan movimiento.",
            };
        }

        if (data.sucursalId) {
            const sucursal = await prisma.sucursal.findFirst({
                where: {
                    id: data.sucursalId,
                    empresaId,
                    estado: EstadoRegistro.ACTIVO,
                },
                select: {
                    id: true,
                },
            });

            if (!sucursal) {
                return {
                    ok: false,
                    message: "La sucursal seleccionada no es válida.",
                };
            }
        }

        const totalDebe = data.detalles.reduce(
            (total, detalle) => total + toNumber(detalle.debe),
            0
        );

        const totalHaber = data.detalles.reduce(
            (total, detalle) => total + toNumber(detalle.haber),
            0
        );

        await prisma.$transaction(async (tx) => {
            await tx.asientoDetalle.deleteMany({
                where: {
                    asientoId: id,
                },
            });

            await tx.asientoContable.update({
                where: {
                    id,
                },
                data: {
                    sucursalId: data.sucursalId || null,
                    fecha,
                    concepto: data.concepto.trim(),
                    totalDebe,
                    totalHaber,
                    detalles: {
                        create: data.detalles.map((detalle) => ({
                            cuentaContableId: detalle.cuentaContableId,
                            descripcion: detalle.descripcion?.trim() || null,
                            debe: toNumber(detalle.debe),
                            haber: toNumber(detalle.haber),
                        })),
                    },
                },
            });
        });

        revalidatePath("/asientos-contables");
        revalidatePath(`/asientos-contables/${id}`);
        revalidatePath(`/asientos-contables/${id}/editar`);

        return {
            ok: true,
            message: "Asiento contable actualizado correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar asiento contable:", error);

        return {
            ok: false,
            message: "No se pudo actualizar el asiento contable.",
        };
    }
}