"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

interface GetCuentasContablesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getCuentasContablesAction({
    page = 1,
    limit = 10,
    search = "",
}: GetCuentasContablesParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const skip = (page - 1) * limit;
        const searchTerm = search.trim();

        const where = {
            empresaId,
            ...(searchTerm
                ? {
                    OR: [
                        {
                            codigo: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            nombre: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            descripcion: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                }
                : {}),
        };

        const [cuentas, total] = await Promise.all([
            prisma.cuentaContable.findMany({
                where,
                select: {
                    id: true,
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
                    cuentaPadre: {
                        select: {
                            id: true,
                            codigo: true,
                            nombre: true,
                        },
                    },
                },
                orderBy: {
                    codigo: "asc",
                },
                skip,
                take: limit,
            }),

            prisma.cuentaContable.count({
                where,
            }),
        ]);

        return {
            ok: true,
            cuentas,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            message: "Cuentas contables obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener cuentas contables:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                cuentas: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
                message:
                    "Debe seleccionar una empresa activa para ver el plan de cuentas.",
            };
        }

        return {
            ok: false,
            cuentas: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
            message: "No se pudieron obtener las cuentas contables.",
        };
    }
}