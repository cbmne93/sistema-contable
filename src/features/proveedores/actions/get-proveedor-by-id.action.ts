
"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

interface GetProveedorByIdParams {
    id: string;
}

export async function getProveedorByIdAction({
    id,
}: GetProveedorByIdParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const proveedor = await prisma.proveedor.findFirst({
            where: {
                id,
                empresaId,
            },
        });

        if (!proveedor) {
            return {
                ok: false,
                proveedor: null,
                message: "Proveedor no encontrado.",
            };
        }

        return {
            ok: true,
            proveedor,
            message: "Proveedor obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener proveedor:", error);

        return {
            ok: false,
            proveedor: null,
            message: "No se pudo obtener el proveedor.",
        };
    }
}