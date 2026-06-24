"use server";

import { revalidatePath } from "next/cache";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function deleteMarangatuRegistroAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const registro = await prisma.marangatuRegistro.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                estado: true,
                codigo: true,
            },
        });

        if (!registro) {
            return {
                ok: false,
                message: "No se encontró el registro.",
            };
        }

        if (registro.estado !== "ANULADO") {
            return {
                ok: false,
                message: "Solo se pueden eliminar registros anulados.",
            };
        }

        await prisma.marangatuRegistro.delete({
            where: {
                id: registro.id,
            },
        });

        revalidatePath("/reportes/marangatu");

        return {
            ok: true,
            message: `Registro ${registro.codigo} eliminado correctamente.`,
        };
    } catch (error) {
        console.error("Error al eliminar registro Marangatu:", error);

        return {
            ok: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el registro.",
        };
    }
}