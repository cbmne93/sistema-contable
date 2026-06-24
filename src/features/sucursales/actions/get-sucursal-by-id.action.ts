
"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

interface GetSucursalByIdParams {
    id: string;
}

export async function getSucursalByIdAction({ id }: GetSucursalByIdParams) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id,
                empresaId,
            },
        });

        if (!sucursal) {
            return {
                ok: false,
                sucursal: null,
                message: "Sucursal no encontrada.",
            };
        }

        return {
            ok: true,
            sucursal,
            message: "Sucursal obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener sucursal:", error);

        return {
            ok: false,
            sucursal: null,
            message: "No se pudo obtener la sucursal.",
        };
    }
}