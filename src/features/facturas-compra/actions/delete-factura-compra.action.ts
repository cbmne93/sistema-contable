"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { validarComprobanteSinAsientoRelacionado } from "@/features/comprobantes/helpers";

export async function deleteFacturaCompraAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const factura = await prisma.comprobante.findFirst({
            where: {
                id,
                empresaId,
                tipoMovimiento: "EGRESO",
                tipoComprobante: "FACTURA",
            },
            select: {
                id: true,
            },
        });

        if (!factura) {
            return {
                ok: false,
                message: "No se encontró la factura de compra.",
            };
        }

        const validacionAsiento =
            await validarComprobanteSinAsientoRelacionado({
                empresaId,
                comprobanteId: id,
                accion: "eliminar",
            });

        if (!validacionAsiento.ok) {
            return {
                ok: false,
                message: validacionAsiento.message,
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.comprobanteDetalle.deleteMany({
                where: {
                    comprobanteId: id,
                },
            });

            await tx.comprobante.delete({
                where: {
                    id,
                },
            });
        });

        revalidatePath("/facturas-compra");

        return {
            ok: true,
            message: "Factura de compra eliminada correctamente.",
        };
    } catch (error) {
        console.error("Error al eliminar factura de compra:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                message:
                    "Debe seleccionar una empresa activa antes de eliminar facturas de compra.",
            };
        }

        return {
            ok: false,
            message: "No se pudo eliminar la factura de compra.",
        };
    }
}