"use server";

import { revalidatePath } from "next/cache";

import { EstadoRegistro } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function toggleCuentaContableEstadoAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const cuenta = await prisma.cuentaContable.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                nivel: true,
                estado: true,
                _count: {
                    select: {
                        subCuentas: {
                            where: {
                                estado: EstadoRegistro.ACTIVO,
                            },
                        },
                    },
                },
            },
        });

        if (!cuenta) {
            return {
                ok: false,
                message: "No se encontró la cuenta contable.",
            };
        }

        if (cuenta.codigo.length <= 2 || cuenta.nivel <= 2) {
            return {
                ok: false,
                message:
                    "No se pueden activar o desactivar las cuentas principales del plan de cuentas.",
            };
        }

        const nuevoEstado =
            cuenta.estado === EstadoRegistro.ACTIVO
                ? EstadoRegistro.INACTIVO
                : EstadoRegistro.ACTIVO;

        if (
            nuevoEstado === EstadoRegistro.INACTIVO &&
            cuenta._count.subCuentas > 0
        ) {
            return {
                ok: false,
                message:
                    "No se puede desactivar esta cuenta porque tiene subcuentas activas.",
            };
        }

        await prisma.cuentaContable.update({
            where: {
                id: cuenta.id,
            },
            data: {
                estado: nuevoEstado,
            },
        });

        revalidatePath("/plan-cuentas");

        return {
            ok: true,
            message:
                nuevoEstado === EstadoRegistro.ACTIVO
                    ? "Cuenta contable activada correctamente."
                    : "Cuenta contable desactivada correctamente.",
        };
    } catch (error) {
        console.error("Error al cambiar estado de cuenta contable:", error);

        return {
            ok: false,
            message: "No se pudo cambiar el estado de la cuenta contable.",
        };
    }
}