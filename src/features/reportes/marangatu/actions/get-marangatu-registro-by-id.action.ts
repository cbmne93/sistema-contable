"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function getMarangatuRegistroByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const registro = await prisma.marangatuRegistro.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                codigo: true,
                version: true,
                anio: true,
                mes: true,
                tipoInforme: true,
                estado: true,
                registrosCompra: true,
                registrosVenta: true,
                registrosEgreso: true,
                registrosIngreso: true,
                fechaGeneracion: true,
                fechaAnulacion: true,
                _count: {
                    select: {
                        detalles: true,
                    },
                },
            },
        });

        if (!registro) {
            return {
                ok: false,
                registro: null,
                message: "No se encontró la versión generada.",
            };
        }

        return {
            ok: true,
            registro: {
                ...registro,
                totalLineas: registro._count.detalles,
                fechaGeneracion: registro.fechaGeneracion.toISOString(),
                fechaAnulacion: registro.fechaAnulacion
                    ? registro.fechaAnulacion.toISOString()
                    : null,
            },
            message: "Versión obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener versión Marangatu:", error);

        return {
            ok: false,
            registro: null,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo obtener la versión generada.",
        };
    }
}