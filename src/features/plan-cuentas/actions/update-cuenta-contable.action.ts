"use server";

import { revalidatePath } from "next/cache";

import {
    EstadoRegistro,
    MonedaCuentaContable,
    NaturalezaCuentaContable,
    TipoCuentaContable,
} from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import {
    cuentaContableSchema,
    type CuentaContableFormValues,
} from "../validations";
import { formatCuentaContableNombre } from "../utils";

export async function updateCuentaContableAction(
    id: string,
    values: CuentaContableFormValues
) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const parsed = cuentaContableSchema.safeParse(values);

        if (!parsed.success) {
            return {
                ok: false,
                message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
            };
        }

        const data = parsed.data;

        const cuentaActual = await prisma.cuentaContable.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                codigo: true,
                cuentaPadreId: true,
                aceptaMovimiento: true,
                nivel: true,
            },
        });

        if (!cuentaActual) {
            return {
                ok: false,
                message: "No se encontró la cuenta contable.",
            };
        }

        if (cuentaActual.codigo.length <= 2 || cuentaActual.nivel <= 2) {
            return {
                ok: false,
                message:
                    "No se pueden modificar las cuentas principales del plan de cuentas.",
            };
        }

        const existeCodigo = await prisma.cuentaContable.findFirst({
            where: {
                empresaId,
                codigo: data.codigo,
                NOT: {
                    id,
                },
            },
            select: {
                id: true,
            },
        });

        if (existeCodigo) {
            return {
                ok: false,
                message:
                    "Ya existe otra cuenta contable con este código en la empresa activa.",
            };
        }

        const cuentaPadre = await prisma.cuentaContable.findFirst({
            where: {
                id: data.cuentaPadreId,
                empresaId,
                estado: EstadoRegistro.ACTIVO,
            },
            select: {
                id: true,
                codigo: true,
                nivel: true,
                tipo: true,
                naturaleza: true,
                aceptaMovimiento: true,
            },
        });

        if (!cuentaPadre) {
            return {
                ok: false,
                message: "La cuenta padre seleccionada no existe.",
            };
        }

        if (cuentaPadre.id === id) {
            return {
                ok: false,
                message: "La cuenta no puede ser padre de sí misma.",
            };
        }

        const esSubcuentaDeLaCuentaActual =
            await prisma.cuentaContable.findFirst({
                where: {
                    id: cuentaPadre.id,
                    empresaId,
                    codigo: {
                        startsWith: `${cuentaActual.codigo}.`,
                    },
                },
                select: {
                    id: true,
                },
            });

        if (esSubcuentaDeLaCuentaActual) {
            return {
                ok: false,
                message:
                    "No puede seleccionar como cuenta padre una subcuenta de la cuenta que está editando.",
            };
        }

        if (cuentaPadre.aceptaMovimiento) {
            return {
                ok: false,
                message:
                    "La cuenta padre seleccionada no puede ser una cuenta de movimiento.",
            };
        }

        if (!data.codigo.startsWith(cuentaPadre.codigo)) {
            return {
                ok: false,
                message:
                    "El código de la cuenta debe iniciar con el código de la cuenta padre.",
            };
        }

        if (data.codigo === cuentaPadre.codigo) {
            return {
                ok: false,
                message:
                    "El código de la cuenta no puede ser igual al código de la cuenta padre.",
            };
        }

        if (data.nivel !== cuentaPadre.nivel + 1) {
            return {
                ok: false,
                message:
                    "El nivel de la cuenta debe ser el siguiente nivel de la cuenta padre.",
            };
        }

        if (data.tipo !== cuentaPadre.tipo) {
            return {
                ok: false,
                message:
                    "El tipo de la cuenta debe coincidir con el tipo de la cuenta padre.",
            };
        }

        if (data.naturaleza !== cuentaPadre.naturaleza) {
            return {
                ok: false,
                message:
                    "La naturaleza de la cuenta debe coincidir con la naturaleza de la cuenta padre.",
            };
        }

        const tieneSubcuentas = await prisma.cuentaContable.count({
            where: {
                empresaId,
                cuentaPadreId: id,
            },
        });

        if (tieneSubcuentas > 0 && data.aceptaMovimiento) {
            return {
                ok: false,
                message:
                    "No puede marcar como movimiento una cuenta que tiene subcuentas.",
            };
        }

        const nombreFormateado = formatCuentaContableNombre({
            nombre: data.nombre,
            aceptaMovimiento: data.aceptaMovimiento,
        });

        await prisma.$transaction(async (tx) => {
            await tx.cuentaContable.update({
                where: {
                    id: cuentaPadre.id,
                },
                data: {
                    aceptaMovimiento: false,
                },
            });

            await tx.cuentaContable.update({
                where: {
                    id,
                },
                data: {
                    cuentaPadreId: data.cuentaPadreId,

                    codigo: data.codigo,
                    nombre: nombreFormateado,
                    descripcion: data.descripcion || null,

                    tipo: data.tipo as TipoCuentaContable,
                    naturaleza: data.naturaleza as NaturalezaCuentaContable,
                    nivel: data.nivel,

                    aceptaMovimiento: data.aceptaMovimiento,

                    moneda: data.moneda as MonedaCuentaContable,
                    requiereAjusteCambio: data.requiereAjusteCambio,
                },
            });
        });

        revalidatePath("/plan-cuentas");
        revalidatePath(`/plan-cuentas/${id}/editar`);

        return {
            ok: true,
            message: "Cuenta contable actualizada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar cuenta contable:", error);

        return {
            ok: false,
            message: "No se pudo actualizar la cuenta contable.",
        };
    }
}