"use server";

import { revalidatePath } from "next/cache";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

interface DeleteSucursalParams {
    id: string;
}

export async function deleteSucursalAction({ id }: DeleteSucursalParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const result = await prisma.$transaction(async (tx) => {
            const sucursalExistente = await tx.sucursal.findFirst({
                where: {
                    id,
                    empresaId,
                },
                select: {
                    id: true,
                    nombre: true,
                    estado: true,
                },
            });

            if (!sucursalExistente) {
                return {
                    ok: false,
                    action: null,
                    sucursal: null,
                    message: "Sucursal no encontrada.",
                };
            }

            const [timbrados, comprobantes, asientos] = await Promise.all([
                tx.timbrado.count({
                    where: {
                        empresaId,
                        sucursalId: id,
                    },
                }),
                tx.comprobante.count({
                    where: {
                        empresaId,
                        sucursalId: id,
                    },
                }),
                tx.asientoContable.count({
                    where: {
                        empresaId,
                        sucursalId: id,
                    },
                }),
            ]);

            const tieneMovimientos =
                timbrados > 0 || comprobantes > 0 || asientos > 0;

            if (tieneMovimientos) {
                if (sucursalExistente.estado === "INACTIVO") {
                    return {
                        ok: false,
                        action: null,
                        sucursal: null,
                        message: "La sucursal ya se encuentra inactiva.",
                    };
                }

                const sucursal = await tx.sucursal.update({
                    where: {
                        id,
                    },
                    data: {
                        estado: "INACTIVO",
                    },
                });

                return {
                    ok: true,
                    action: "DESACTIVADA",
                    sucursal,
                    message:
                        "Sucursal desactivada correctamente porque ya tiene movimientos asociados.",
                };
            }

            const sucursal = await tx.sucursal.delete({
                where: {
                    id,
                },
            });

            return {
                ok: true,
                action: "ELIMINADA",
                sucursal,
                message: "Sucursal eliminada correctamente.",
            };
        });

        revalidatePath("/sucursales");

        return result;
    } catch (error) {
        console.error("Error al eliminar o desactivar sucursal:", error);

        return {
            ok: false,
            action: null,
            sucursal: null,
            message: "No se pudo procesar la sucursal.",
        };
    }
}