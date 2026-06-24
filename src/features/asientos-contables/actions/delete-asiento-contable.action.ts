"use server";

import { revalidatePath } from "next/cache";

import {
    EstadoAsientoContable,
    OrigenAsientoContable,
} from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

function puedeEliminarAsientoAutomatico(origen: OrigenAsientoContable) {
    return (
        origen === OrigenAsientoContable.COMPRA ||
        origen === OrigenAsientoContable.VENTA
    );
}

export async function deleteAsientoContableAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const asiento = await prisma.asientoContable.findFirst({
            where: {
                id,
                empresaId,
                periodoFiscalId: periodoFiscal.id,
            },
            select: {
                id: true,
                numero: true,
                origen: true,
                estado: true,
                comprobanteId: true,
            },
        });

        if (!asiento) {
            return {
                ok: false,
                message: "No se encontró el asiento contable.",
            };
        }

        if (asiento.estado === EstadoAsientoContable.ANULADO) {
            return {
                ok: false,
                message: "No se puede eliminar un asiento anulado.",
            };
        }

        if (asiento.origen === OrigenAsientoContable.MANUAL) {
            if (asiento.comprobanteId) {
                return {
                    ok: false,
                    message:
                        "No se puede eliminar un asiento manual relacionado a un comprobante.",
                };
            }
        } else if (puedeEliminarAsientoAutomatico(asiento.origen)) {
            if (!asiento.comprobanteId) {
                return {
                    ok: false,
                    message:
                        "No se puede eliminar este asiento automático porque no está vinculado a un comprobante.",
                };
            }

            if (asiento.estado !== EstadoAsientoContable.CONFIRMADO) {
                return {
                    ok: false,
                    message:
                        "Solo se pueden eliminar asientos automáticos confirmados.",
                };
            }
        } else {
            return {
                ok: false,
                message:
                    "Solo se pueden eliminar asientos manuales o asientos automáticos de compra/venta.",
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.asientoDetalle.deleteMany({
                where: {
                    asientoId: id,
                },
            });

            await tx.asientoContable.delete({
                where: {
                    id,
                },
            });
        });

        revalidatePath("/asientos-contables");
        revalidatePath("/facturas-compra");
        revalidatePath("/facturas-venta");

        if (asiento.comprobanteId) {
            revalidatePath(`/facturas-compra/${asiento.comprobanteId}`);
            revalidatePath(`/facturas-compra/${asiento.comprobanteId}/editar`);
            revalidatePath(`/facturas-venta/${asiento.comprobanteId}`);
            revalidatePath(`/facturas-venta/${asiento.comprobanteId}/editar`);
        }

        return {
            ok: true,
            message:
                asiento.origen === OrigenAsientoContable.MANUAL
                    ? "Asiento contable eliminado correctamente."
                    : `Asiento automático N° ${asiento.numero} eliminado correctamente. Ahora puede editar, eliminar o anular el comprobante relacionado.`,
        };
    } catch (error) {
        console.error("Error al eliminar asiento contable:", error);

        return {
            ok: false,
            message: "No se pudo eliminar el asiento contable.",
        };
    }
}