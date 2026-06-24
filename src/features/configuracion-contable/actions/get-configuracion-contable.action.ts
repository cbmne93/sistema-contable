"use server";

import { EstadoRegistro } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function getConfiguracionContableAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const [configuracion, cuentas] = await Promise.all([
            prisma.configuracionContable.findUnique({
                where: {
                    empresaId,
                },
            }),

            prisma.cuentaContable.findMany({
                where: {
                    empresaId,
                    estado: EstadoRegistro.ACTIVO,
                    aceptaMovimiento: true,
                },
                select: {
                    id: true,
                    codigo: true,
                    nombre: true,
                    tipo: true,
                    naturaleza: true,
                },
                orderBy: {
                    codigo: "asc",
                },
            }),
        ]);

        return {
            ok: true,
            configuracion,
            options: {
                cuentas,
            },
            message: "Configuración contable obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener configuración contable:", error);

        return {
            ok: false,
            configuracion: null,
            options: {
                cuentas: [],
            },
            message: "No se pudo obtener la configuración contable.",
        };
    }
}