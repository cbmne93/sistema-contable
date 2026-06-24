"use server";

import { TipoMovimiento } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

interface GetClientesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getClientesAction({
    page = 1,
    limit = 10,
    search = "",
}: GetClientesParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const currentPage = Math.max(page, 1);
        const currentLimit = Math.max(limit, 1);
        const skip = (currentPage - 1) * currentLimit;
        const searchTerm = search.trim();

        const where = {
            empresaId,
            ...(searchTerm
                ? {
                    OR: [
                        {
                            nombre: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            numeroDocumento: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            email: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                }
                : {}),
        };

        const [clientes, total] = await Promise.all([
            prisma.cliente.findMany({
                where,
                skip,
                take: currentLimit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.cliente.count({
                where,
            }),
        ]);

        const clientesConUso = await Promise.all(
            clientes.map(async (cliente) => {
                const comprobantes = await prisma.comprobante.count({
                    where: {
                        empresaId,
                        clienteId: cliente.id,
                        tipoMovimiento: TipoMovimiento.INGRESO,
                    },
                });

                return {
                    ...cliente,
                    tieneMovimientos: comprobantes > 0,
                };
            })
        );

        return {
            ok: true,
            clientes: clientesConUso,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages: Math.max(Math.ceil(total / currentLimit), 1),
            },
            message: "Clientes obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener clientes:", error);

        return {
            ok: false,
            clientes: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
            },
            message: "No se pudieron obtener los clientes.",
        };
    }
}