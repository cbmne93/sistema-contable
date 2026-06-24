"use server";

import { TipoMovimiento } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function getProveedoresAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const proveedores = await prisma.proveedor.findMany({
            where: {
                empresaId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const proveedoresConUso = await Promise.all(
            proveedores.map(async (proveedor) => {
                const [comprobantes, timbrados] = await Promise.all([
                    prisma.comprobante.count({
                        where: {
                            empresaId,
                            proveedorId: proveedor.id,
                            tipoMovimiento: TipoMovimiento.EGRESO,
                        },
                    }),
                    prisma.timbrado.count({
                        where: {
                            empresaId,
                            proveedorId: proveedor.id,
                        },
                    }),
                ]);

                return {
                    ...proveedor,
                    tieneMovimientos: comprobantes > 0 || timbrados > 0,
                };
            })
        );

        return {
            ok: true,
            proveedores: proveedoresConUso,
            message: "Proveedores obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener proveedores:", error);

        return {
            ok: false,
            proveedores: [],
            message: "No se pudieron obtener los proveedores.",
        };
    }
}