
"use server";

import { prisma } from "@/lib/prisma";

interface GetEmpresaByIdParams {
    id: string;
}

export async function getEmpresaByIdAction({ id }: GetEmpresaByIdParams) {
    try {
        const empresa = await prisma.empresa.findUnique({
            where: {
                id,
            },
        });

        if (!empresa) {
            return {
                ok: false,
                empresa: null,
                message: "Empresa no encontrada.",
            };
        }

        return {
            ok: true,
            empresa,
            message: "Empresa obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener empresa:", error);

        return {
            ok: false,
            empresa: null,
            message: "No se pudo obtener la empresa.",
        };
    }
}