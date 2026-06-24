"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function getSucursalesAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const sucursales = await prisma.sucursal.findMany({
            where: {
                empresaId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const sucursalesConUso = await Promise.all(
            sucursales.map(async (sucursal) => {
                const [timbrados, comprobantes, asientos] = await Promise.all([
                    prisma.timbrado.count({
                        where: {
                            empresaId,
                            sucursalId: sucursal.id,
                        },
                    }),
                    prisma.comprobante.count({
                        where: {
                            empresaId,
                            sucursalId: sucursal.id,
                        },
                    }),
                    prisma.asientoContable.count({
                        where: {
                            empresaId,
                            sucursalId: sucursal.id,
                        },
                    }),
                ]);

                return {
                    ...sucursal,
                    tieneMovimientos:
                        timbrados > 0 || comprobantes > 0 || asientos > 0,
                };
            })
        );

        return {
            ok: true,
            sucursales: sucursalesConUso,
            message: "Sucursales obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener sucursales:", error);

        return {
            ok: false,
            sucursales: [],
            message: "No se pudieron obtener las sucursales.",
        };
    }
}