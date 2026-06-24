"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function getCuentaContableByIdAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const cuenta = await prisma.cuentaContable.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                cuentaPadreId: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                tipo: true,
                naturaleza: true,
                nivel: true,
                aceptaMovimiento: true,
                moneda: true,
                requiereAjusteCambio: true,
                estado: true,
            },
        });

        if (!cuenta) {
            return {
                ok: false,
                cuenta: null,
                message: "No se encontró la cuenta contable.",
            };
        }

        return {
            ok: true,
            cuenta: {
                cuentaPadreId: cuenta.cuentaPadreId ?? "",
                codigo: cuenta.codigo,
                nombre: cuenta.nombre,
                descripcion: cuenta.descripcion ?? "",
                tipo: cuenta.tipo,
                naturaleza: cuenta.naturaleza,
                nivel: cuenta.nivel,
                aceptaMovimiento: cuenta.aceptaMovimiento,
                moneda: cuenta.moneda,
                requiereAjusteCambio: cuenta.requiereAjusteCambio,
            },
            message: "Cuenta contable obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener cuenta contable:", error);

        return {
            ok: false,
            cuenta: null,
            message: "No se pudo obtener la cuenta contable.",
        };
    }
}