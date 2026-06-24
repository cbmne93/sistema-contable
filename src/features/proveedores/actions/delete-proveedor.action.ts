"use server";

import { revalidatePath } from "next/cache";

import { TipoMovimiento } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

interface DeleteProveedorParams {
    id: string;
}

export async function deleteProveedorAction({ id }: DeleteProveedorParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const result = await prisma.$transaction(async (tx) => {
            const proveedorExistente = await tx.proveedor.findFirst({
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

            if (!proveedorExistente) {
                return {
                    ok: false,
                    action: null,
                    proveedor: null,
                    message: "Proveedor no encontrado.",
                };
            }

            const [comprobantes, timbrados] = await Promise.all([
                tx.comprobante.count({
                    where: {
                        empresaId,
                        proveedorId: id,
                        tipoMovimiento: TipoMovimiento.EGRESO,
                    },
                }),
                tx.timbrado.count({
                    where: {
                        empresaId,
                        proveedorId: id,
                    },
                }),
            ]);

            const tieneMovimientos = comprobantes > 0 || timbrados > 0;

            if (tieneMovimientos) {
                if (proveedorExistente.estado === "INACTIVO") {
                    return {
                        ok: false,
                        action: null,
                        proveedor: null,
                        message: "El proveedor ya se encuentra inactivo.",
                    };
                }

                const proveedor = await tx.proveedor.update({
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
                    proveedor,
                    message:
                        "Proveedor desactivado correctamente porque ya tiene movimientos asociados.",
                };
            }

            const proveedor = await tx.proveedor.delete({
                where: {
                    id,
                },
            });

            return {
                ok: true,
                action: "ELIMINADO",
                proveedor,
                message: "Proveedor eliminado correctamente.",
            };
        });

        revalidatePath("/proveedores");
        revalidatePath("/facturas-compra");
        revalidatePath("/timbrados");

        return result;
    } catch (error) {
        console.error("Error al eliminar o desactivar proveedor:", error);

        return {
            ok: false,
            action: null,
            proveedor: null,
            message: "No se pudo procesar el proveedor.",
        };
    }
}