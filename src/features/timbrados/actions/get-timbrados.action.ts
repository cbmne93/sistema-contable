"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

interface GetTimbradosParams {
    page?: number;
    limit?: number;
    search?: string;
    origen?: "PROPIO" | "PROVEEDOR";
}

export async function getTimbradosAction({
    page = 1,
    limit = 10,
    search = "",
    origen,
}: GetTimbradosParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const currentPage = Math.max(page, 1);
        const currentLimit = Math.max(limit, 1);
        const skip = (currentPage - 1) * currentLimit;
        const searchTerm = search.trim();

        const where = {
            empresaId,
            ...(origen ? { origen } : {}),
            ...(searchTerm
                ? {
                    OR: [
                        {
                            numero: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            establecimiento: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            puntoExpedicion: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            sucursal: {
                                nombre: {
                                    contains: searchTerm,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            proveedor: {
                                nombre: {
                                    contains: searchTerm,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    ],
                }
                : {}),
        };

        const [timbrados, total] = await Promise.all([
            prisma.timbrado.findMany({
                where,
                include: {
                    sucursal: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    proveedor: {
                        select: {
                            id: true,
                            nombre: true,
                            numeroDocumento: true,
                        },
                    },
                },
                orderBy: [
                    {
                        createdAt: "desc",
                    },
                ],
                skip,
                take: currentLimit,
            }),
            prisma.timbrado.count({
                where,
            }),
        ]);

        const timbradosConUso = await Promise.all(
            timbrados.map(async (timbrado) => {
                const comprobantes = await prisma.comprobante.count({
                    where: {
                        empresaId,
                        timbradoId: timbrado.id,
                    },
                });

                return {
                    ...timbrado,
                    tieneMovimientos: comprobantes > 0,
                };
            })
        );

        return {
            ok: true,
            timbrados: timbradosConUso,
            total,
            totalPages: Math.max(Math.ceil(total / currentLimit), 1),
            currentPage,
            message: "Timbrados obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener timbrados:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                timbrados: [],
                total: 0,
                totalPages: 0,
                currentPage: page,
                message: "Debe seleccionar una empresa activa para ver timbrados.",
            };
        }

        return {
            ok: false,
            timbrados: [],
            total: 0,
            totalPages: 0,
            currentPage: page,
            message: "No se pudieron obtener los timbrados.",
        };
    }
}