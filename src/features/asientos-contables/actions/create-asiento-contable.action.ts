"use server";

import { revalidatePath } from "next/cache";

import {
    EstadoAsientoContable,
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

export async function createAsientoContableAction(
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

        const asiento = await prisma.$transaction(async (tx) => {
            const ultimoAsiento = await tx.asientoContable.findFirst({
                where: {
                    empresaId,
                    periodoFiscalId: periodoFiscal.id,
                },
                select: {
                    numero: true,
                },
                orderBy: {
                    numero: "desc",
                },
            });

            const numero = (ultimoAsiento?.numero ?? 0) + 1;

            return tx.asientoContable.create({
                data: {
                    empresaId,
                    periodoFiscalId: periodoFiscal.id,
                    sucursalId: data.sucursalId || null,

                    numero,
                    fecha,
                    concepto: data.concepto.trim(),

                    origen: OrigenAsientoContable.MANUAL,
                    estado: EstadoAsientoContable.CONFIRMADO,

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
                select: {
                    id: true,
                },
            });
        });

        revalidatePath("/asientos-contables");

        return {
            ok: true,
            asientoId: asiento.id,
            message: "Asiento contable creado correctamente.",
        };
    } catch (error) {
        console.error("Error al crear asiento contable:", error);

        return {
            ok: false,
            message: "No se pudo crear el asiento contable.",
        };
    }
}