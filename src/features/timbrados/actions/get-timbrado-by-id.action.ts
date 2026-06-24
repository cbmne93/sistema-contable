"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function getTimbradoByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const timbrado = await prisma.timbrado.findFirst({
            where: {
                id,
                empresaId,
            },
            include: {
                sucursal: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        numeroDocumento: true,
                    },
                },
            },
        });

        if (!timbrado) {
            return {
                ok: false,
                timbrado: null,
                message: "No se encontró el timbrado.",
            };
        }

        return {
            ok: true,
            timbrado,
            message: "Timbrado obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener timbrado:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                timbrado: null,
                message: "Debe seleccionar una empresa activa para ver el timbrado.",
            };
        }

        return {
            ok: false,
            timbrado: null,
            message: "No se pudo obtener el timbrado.",
        };
    }
}