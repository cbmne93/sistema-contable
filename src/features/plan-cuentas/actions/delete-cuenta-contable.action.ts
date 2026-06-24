"use server";

import { revalidatePath } from "next/cache";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function deleteCuentaContableAction(id: string) {
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
                _count: {
                    select: {
                        subCuentas: true,
                        detallesComprobante: true,
                        detallesAsiento: true,
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
                    "No se pueden eliminar las cuentas principales del plan de cuentas.",
            };
        }

        if (cuenta._count.subCuentas > 0) {
            return {
                ok: false,
                message:
                    "No se puede eliminar esta cuenta porque tiene subcuentas asociadas.",
            };
        }

        if (cuenta._count.detallesComprobante > 0) {
            return {
                ok: false,
                message:
                    "No se puede eliminar esta cuenta porque ya fue utilizada en comprobantes.",
            };
        }

        if (cuenta._count.detallesAsiento > 0) {
            return {
                ok: false,
                message:
                    "No se puede eliminar esta cuenta porque ya fue utilizada en asientos contables.",
            };
        }

        await prisma.cuentaContable.delete({
            where: {
                id,
            },
        });

        revalidatePath("/plan-cuentas");

        return {
            ok: true,
            message: "Cuenta contable eliminada correctamente.",
        };
    } catch (error) {
        console.error("Error al eliminar cuenta contable:", error);

        return {
            ok: false,
            message: "No se pudo eliminar la cuenta contable.",
        };
    }
}