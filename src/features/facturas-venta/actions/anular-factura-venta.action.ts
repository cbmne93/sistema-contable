"use server";

import { revalidatePath } from "next/cache";

import { EstadoComprobante, TipoMovimiento } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { validarComprobanteSinAsientoRelacionado } from "@/features/comprobantes/helpers";
import { prisma } from "@/lib/prisma";

export async function anularFacturaVentaAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const factura = await prisma.comprobante.findFirst({
            where: {
                id,
                empresaId,
                tipoMovimiento: TipoMovimiento.INGRESO,
            },
            select: {
                id: true,
                estado: true,
            },
        });

        if (!factura) {
            return {
                ok: false,
                message: "No se encontró la factura de venta.",
            };
        }

        if (factura.estado === EstadoComprobante.ANULADO) {
            return {
                ok: false,
                message: "La factura ya se encuentra anulada.",
            };
        }

        const validacionAsiento =
            await validarComprobanteSinAsientoRelacionado({
                empresaId,
                comprobanteId: id,
                accion: "anular",
            });

        if (!validacionAsiento.ok) {
            return {
                ok: false,
                message: validacionAsiento.message,
            };
        }

        await prisma.comprobante.update({
            where: {
                id: factura.id,
            },
            data: {
                estado: EstadoComprobante.ANULADO,
            },
        });

        revalidatePath("/facturas-venta");
        revalidatePath(`/facturas-venta/${factura.id}`);

        return {
            ok: true,
            message: "Factura anulada correctamente.",
        };
    } catch (error) {
        console.error("Error al anular factura de venta:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                message:
                    "Debe seleccionar una empresa activa antes de anular facturas de venta.",
            };
        }

        return {
            ok: false,
            message: "Ocurrió un error al anular la factura.",
        };
    }
}