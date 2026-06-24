"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";

type FacturasCompraSort = "createdAt" | "factura" | "fecha";
type SortOrder = "asc" | "desc";
type MonthFilter = "all" | `${number}`;

interface GetFacturasCompraParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: FacturasCompraSort;
    order?: SortOrder;
    month?: MonthFilter;
}

function getOrderBy(sort: FacturasCompraSort, order: SortOrder) {
    if (sort === "factura") {
        return [
            { establecimiento: order },
            { puntoExpedicion: order },
            { numeroComprobante: order },
        ];
    }

    if (sort === "fecha") {
        return [{ fechaEmision: order }, { createdAt: "desc" as const }];
    }

    return {
        createdAt: "desc" as const,
    };
}

function getMonthDateRange({
    month,
    periodoFiscal,
}: {
    month: MonthFilter;
    periodoFiscal: {
        fechaInicio: Date;
        fechaFin: Date;
        anio: number;
    };
}) {
    if (month === "all") {
        return {
            gte: periodoFiscal.fechaInicio,
            lte: periodoFiscal.fechaFin,
        };
    }

    const monthNumber = Number(month);

    if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return {
            gte: periodoFiscal.fechaInicio,
            lte: periodoFiscal.fechaFin,
        };
    }

    const fechaInicioMes = new Date(
        Date.UTC(periodoFiscal.anio, monthNumber - 1, 1, 0, 0, 0, 0)
    );

    const fechaFinMes = new Date(
        Date.UTC(periodoFiscal.anio, monthNumber, 0, 23, 59, 59, 999)
    );

    return {
        gte:
            fechaInicioMes < periodoFiscal.fechaInicio
                ? periodoFiscal.fechaInicio
                : fechaInicioMes,
        lte:
            fechaFinMes > periodoFiscal.fechaFin
                ? periodoFiscal.fechaFin
                : fechaFinMes,
    };
}

export async function getFacturasCompraAction({
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
    month = String(new Date().getMonth() + 1) as MonthFilter,
}: GetFacturasCompraParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const skip = (page - 1) * limit;
        const searchTerm = search.trim();

        const fechaEmisionRange = getMonthDateRange({
            month,
            periodoFiscal,
        });

        const where = {
            empresaId,
            tipoMovimiento: "EGRESO" as const,
            tipoComprobante: "FACTURA" as const,
            fechaEmision: fechaEmisionRange,
            ...(searchTerm
                ? {
                    OR: [
                        {
                            numeroComprobante: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            numeroTimbrado: {
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
                            proveedor: {
                                nombre: {
                                    contains: searchTerm,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            proveedor: {
                                numeroDocumento: {
                                    contains: searchTerm,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    ],
                }
                : {}),
        };

        const [facturas, total] = await Promise.all([
            prisma.comprobante.findMany({
                where,
                include: {
                    proveedor: {
                        select: {
                            id: true,
                            nombre: true,
                            numeroDocumento: true,
                            dv: true,
                        },
                    },
                    sucursal: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    timbrado: {
                        select: {
                            id: true,
                            numero: true,
                            establecimiento: true,
                            puntoExpedicion: true,
                        },
                    },
                    asiento: {
                        select: {
                            id: true,
                            numero: true,
                            origen: true,
                            estado: true,
                        },
                    },
                },
                orderBy: getOrderBy(sort, order),
                skip,
                take: limit,
            }),

            prisma.comprobante.count({
                where,
            }),
        ]);

        const facturasSerializadas = facturas.map((factura) => ({
            ...factura,
            cotizacion: Number(factura.cotizacion),
            exenta: Number(factura.exenta),
            gravada5: Number(factura.gravada5),
            iva5: Number(factura.iva5),
            gravada10: Number(factura.gravada10),
            iva10: Number(factura.iva10),
            total: Number(factura.total),
        }));

        return {
            ok: true,
            facturas: facturasSerializadas,
            periodoFiscal: {
                id: periodoFiscal.id,
                anio: periodoFiscal.anio,
                descripcion: periodoFiscal.descripcion,
                fechaInicio: periodoFiscal.fechaInicio,
                fechaFin: periodoFiscal.fechaFin,
                estado: periodoFiscal.estado,
            },
            filtros: {
                month,
            },
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            message: "Facturas de compra obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener facturas de compra:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                facturas: [],
                periodoFiscal: null,
                filtros: {
                    month,
                },
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
                message:
                    "Debe seleccionar una empresa activa para ver las facturas de compra.",
            };
        }

        return {
            ok: false,
            facturas: [],
            periodoFiscal: null,
            filtros: {
                month,
            },
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
            message: "No se pudieron obtener las facturas de compra.",
        };
    }
}