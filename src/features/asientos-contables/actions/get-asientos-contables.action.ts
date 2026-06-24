"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

import type { AsientoContable } from "../interfaces";

interface GetAsientosContablesParams {
    page?: number;
    limit?: number;
    search?: string;
}

function toNumber(value: unknown) {
    if (value === null || value === undefined) {
        return 0;
    }

    return Number(value);
}

function toDateString(value: Date) {
    return value.toISOString();
}

export async function getAsientosContablesAction({
    page = 1,
    limit = 10,
    search = "",
}: GetAsientosContablesParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
        const currentLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

        const skip = (currentPage - 1) * currentLimit;
        const searchValue = search.trim();
        const numeroSearch = Number(searchValue);

        const where = {
            empresaId,
            periodoFiscalId: periodoFiscal.id,
            ...(searchValue
                ? {
                    OR: [
                        {
                            concepto: {
                                contains: searchValue,
                                mode: "insensitive" as const,
                            },
                        },
                        ...(!Number.isNaN(numeroSearch)
                            ? [
                                {
                                    numero: numeroSearch,
                                },
                            ]
                            : []),
                    ],
                }
                : {}),
        };

        const [asientos, total] = await Promise.all([
            prisma.asientoContable.findMany({
                where,
                select: {
                    id: true,
                    numero: true,
                    fecha: true,
                    concepto: true,
                    origen: true,
                    estado: true,
                    totalDebe: true,
                    totalHaber: true,
                    sucursal: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    comprobante: {
                        select: {
                            id: true,
                            tipoComprobante: true,
                            numeroComprobante: true,
                            establecimiento: true,
                            puntoExpedicion: true,
                        },
                    },
                    _count: {
                        select: {
                            detalles: true,
                        },
                    },
                },
                orderBy: [
                    {
                        fecha: "desc",
                    },
                    {
                        numero: "desc",
                    },
                ],
                skip,
                take: currentLimit,
            }),
            prisma.asientoContable.count({
                where,
            }),
        ]);

        const data: AsientoContable[] = asientos.map((asiento) => ({
            id: asiento.id,
            numero: asiento.numero,
            fecha: toDateString(asiento.fecha),
            concepto: asiento.concepto,
            origen: asiento.origen,
            estado: asiento.estado,
            totalDebe: toNumber(asiento.totalDebe),
            totalHaber: toNumber(asiento.totalHaber),
            cantidadDetalles: asiento._count.detalles,
            sucursal: asiento.sucursal,
            comprobante: asiento.comprobante,
        }));

        return {
            ok: true,
            asientos: data,
            periodoFiscal: {
                id: periodoFiscal.id,
                anio: periodoFiscal.anio,
                descripcion: periodoFiscal.descripcion,
            },
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages: Math.ceil(total / currentLimit),
            },
            message: "Asientos contables obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener asientos contables:", error);

        return {
            ok: false,
            asientos: [],
            periodoFiscal: null,
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            },
            message: "No se pudieron obtener los asientos contables.",
        };
    }
}