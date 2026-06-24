
"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

interface GetClienteByIdParams {
    id: string;
}

export async function getClienteByIdAction({ id }: GetClienteByIdParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const cliente = await prisma.cliente.findFirst({
            where: {
                id,
                empresaId,
            },
        });

        if (!cliente) {
            return {
                ok: false,
                cliente: null,
                message: "Cliente no encontrado.",
            };
        }

        return {
            ok: true,
            cliente,
            message: "Cliente obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener cliente:", error);

        return {
            ok: false,
            cliente: null,
            message: "No se pudo obtener el cliente.",
        };
    }
}