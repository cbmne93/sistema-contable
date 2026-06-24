"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function deleteTimbradoAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const result = await prisma.$transaction(async (tx) => {
            const timbrado = await tx.timbrado.findFirst({
                where: {
                    id,
                    empresaId,
                },
                select: {
                    id: true,
                    estado: true,
                },
            });

            if (!timbrado) {
                return {
                    ok: false,
                    action: null,
                    message: "No se encontró el timbrado.",
                };
            }

            const comprobantes = await tx.comprobante.count({
                where: {
                    empresaId,
                    timbradoId: id,
                },
            });

            if (comprobantes > 0) {
                if (timbrado.estado === "INACTIVO") {
                    return {
                        ok: false,
                        action: null,
                        message: "El timbrado ya se encuentra inactivo.",
                    };
                }

                await tx.timbrado.update({
                    where: {
                        id,
                    },
                    data: {
                        estado: "INACTIVO",
                    },
                });

                return {
                    ok: true,
                    action: "DESACTIVADO",
                    message:
                        "Timbrado desactivado correctamente porque ya tiene comprobantes asociados.",
                };
            }

            await tx.timbrado.delete({
                where: {
                    id,
                },
            });

            return {
                ok: true,
                action: "ELIMINADO",
                message: "Timbrado eliminado correctamente.",
            };
        });

        revalidatePath("/timbrados");
        revalidatePath("/facturas-compra");
        revalidatePath("/facturas-venta");

        return result;
    } catch (error) {
        console.error("Error al eliminar o desactivar timbrado:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                action: null,
                message:
                    "Debe seleccionar una empresa activa antes de procesar timbrados.",
            };
        }

        return {
            ok: false,
            action: null,
            message: "No se pudo procesar el timbrado.",
        };
    }
}