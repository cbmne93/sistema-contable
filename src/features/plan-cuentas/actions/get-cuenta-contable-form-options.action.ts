"use server";

import { EstadoRegistro } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function getCuentaContableFormOptionsAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const cuentasPadre = await prisma.cuentaContable.findMany({
            where: {
                empresaId,
                estado: EstadoRegistro.ACTIVO,
                aceptaMovimiento: false,
                nivel: {
                    gte: 2,
                    lt: 10,
                },
            },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                tipo: true,
                naturaleza: true,
                nivel: true,
                aceptaMovimiento: true,
            },
            orderBy: {
                codigo: "asc",
            },
        });

        return {
            ok: true,
            cuentasPadre,
            message: "Opciones obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener opciones de cuenta contable:", error);

        return {
            ok: false,
            cuentasPadre: [],
            message: "No se pudieron obtener las opciones del formulario.",
        };
    }
}