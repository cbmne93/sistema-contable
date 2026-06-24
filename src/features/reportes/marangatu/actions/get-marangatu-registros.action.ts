"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

function toDateInputValue(date: Date) {
    return date.toISOString();
}

export async function getMarangatuRegistrosAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const registros = await prisma.marangatuRegistro.findMany({
            where: {
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
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            ok: true,
            registros: registros.map((registro) => ({
                ...registro,
                fechaGeneracion: toDateInputValue(registro.fechaGeneracion),
                fechaAnulacion: registro.fechaAnulacion
                    ? toDateInputValue(registro.fechaAnulacion)
                    : null,
            })),
            message: "Registros obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener registros Marangatu:", error);

        return {
            ok: false,
            registros: [],
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudieron obtener los registros.",
        };
    }
}