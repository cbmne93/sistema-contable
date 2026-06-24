"use server";

import { revalidatePath } from "next/cache";

import { TipoMovimiento } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

interface DeleteClienteParams {
    id: string;
}

export async function deleteClienteAction({ id }: DeleteClienteParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const result = await prisma.$transaction(async (tx) => {
            const clienteExistente = await tx.cliente.findFirst({
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

            if (!clienteExistente) {
                return {
                    ok: false,
                    action: null,
                    cliente: null,
                    message: "Cliente no encontrado.",
                };
            }

            const comprobantes = await tx.comprobante.count({
                where: {
                    empresaId,
                    clienteId: id,
                    tipoMovimiento: TipoMovimiento.INGRESO,
                },
            });

            const tieneMovimientos = comprobantes > 0;

            if (tieneMovimientos) {
                if (clienteExistente.estado === "INACTIVO") {
                    return {
                        ok: false,
                        action: null,
                        cliente: null,
                        message: "El cliente ya se encuentra inactivo.",
                    };
                }

                const cliente = await tx.cliente.update({
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
                    cliente,
                    message:
                        "Cliente desactivado correctamente porque ya tiene comprobantes asociados.",
                };
            }

            const cliente = await tx.cliente.delete({
                where: {
                    id,
                },
            });

            return {
                ok: true,
                action: "ELIMINADO",
                cliente,
                message: "Cliente eliminado correctamente.",
            };
        });

        revalidatePath("/clientes");
        revalidatePath("/facturas-venta");

        return result;
    } catch (error) {
        console.error("Error al eliminar o desactivar cliente:", error);

        return {
            ok: false,
            action: null,
            cliente: null,
            message: "No se pudo procesar el cliente.",
        };
    }
}