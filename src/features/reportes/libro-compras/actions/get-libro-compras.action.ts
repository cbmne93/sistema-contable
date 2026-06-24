"use server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

type MonthFilter = "all" | `${number}`;

interface GetLibroComprasParams {
    page?: number;
    limit?: number;
    search?: string;
    month?: MonthFilter;
    proveedorId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}

function getDateAsUTCStart(value?: string | null) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    return new Date(`${value}T00:00:00.000Z`);
}

function getDateAsUTCEnd(value?: string | null) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    return new Date(`${value}T23:59:59.999Z`);
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

function getFechaEmisionRange({
    month,
    fechaDesde,
    fechaHasta,
    periodoFiscal,
}: {
    month: MonthFilter;
    fechaDesde?: string;
    fechaHasta?: string;
    periodoFiscal: {
        fechaInicio: Date;
        fechaFin: Date;
        anio: number;
    };
}) {
    const desde = getDateAsUTCStart(fechaDesde);
    const hasta = getDateAsUTCEnd(fechaHasta);

    if (desde || hasta) {
        return {
            gte:
                desde && desde > periodoFiscal.fechaInicio
                    ? desde
                    : periodoFiscal.fechaInicio,
            lte:
                hasta && hasta < periodoFiscal.fechaFin
                    ? hasta
                    : periodoFiscal.fechaFin,
        };
    }

    return getMonthDateRange({
        month,
        periodoFiscal,
    });
}

function toNumber(value: unknown) {
    return Number(value ?? 0);
}

function formatNumeroFactura({
    establecimiento,
    puntoExpedicion,
    numeroComprobante,
}: {
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroComprobante: string;
}) {
    return `${establecimiento ?? "---"}-${puntoExpedicion ?? "---"
        }-${numeroComprobante}`;
}

function formatDocumento(proveedor: {
    numeroDocumento: string;
    dv: string | null;
} | null) {
    if (!proveedor?.numeroDocumento) {
        return "-";
    }

    return `${proveedor.numeroDocumento}${proveedor.dv ? `-${proveedor.dv}` : ""}`;
}

export async function getLibroComprasAction({
    page = 1,
    limit = 10,
    search = "",
    month = String(new Date().getMonth() + 1) as MonthFilter,
    proveedorId = "",
    fechaDesde = "",
    fechaHasta = "",
}: GetLibroComprasParams = {}) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const skip = (page - 1) * limit;
        const searchTerm = search.trim();
        const proveedorFiltro = proveedorId.trim();

        const fechaEmisionRange = getFechaEmisionRange({
            month,
            fechaDesde,
            fechaHasta,
            periodoFiscal,
        });

        const where = {
            empresaId,
            tipoMovimiento: "EGRESO" as const,
            tipoComprobante: "FACTURA" as const,
            fechaEmision: fechaEmisionRange,
            ...(proveedorFiltro ? { proveedorId: proveedorFiltro } : {}),
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

        const [facturas, total, totales, proveedores] = await Promise.all([
            prisma.comprobante.findMany({
                where,
                select: {
                    id: true,
                    fechaEmision: true,
                    numeroTimbrado: true,
                    establecimiento: true,
                    puntoExpedicion: true,
                    numeroComprobante: true,
                    moneda: true,
                    exenta: true,
                    gravada5: true,
                    iva5: true,
                    gravada10: true,
                    iva10: true,
                    total: true,
                    proveedor: {
                        select: {
                            id: true,
                            nombre: true,
                            numeroDocumento: true,
                            dv: true,
                        },
                    },
                },
                orderBy: [
                    { fechaEmision: "asc" },
                    { establecimiento: "asc" },
                    { puntoExpedicion: "asc" },
                    { numeroComprobante: "asc" },
                ],
                skip,
                take: limit,
            }),

            prisma.comprobante.count({
                where,
            }),

            prisma.comprobante.aggregate({
                where,
                _sum: {
                    exenta: true,
                    gravada5: true,
                    iva5: true,
                    gravada10: true,
                    iva10: true,
                    total: true,
                },
            }),

            prisma.proveedor.findMany({
                where: {
                    empresaId,
                    estado: "ACTIVO",
                },
                select: {
                    id: true,
                    nombre: true,
                    numeroDocumento: true,
                    dv: true,
                },
                orderBy: {
                    nombre: "asc",
                },
            }),
        ]);

        const registros = facturas.map((factura) => ({
            id: factura.id,
            fechaEmision: factura.fechaEmision,
            facturaNumero: formatNumeroFactura(factura),
            numeroTimbrado: factura.numeroTimbrado ?? "-",
            proveedorNombre: factura.proveedor?.nombre ?? "-",
            proveedorDocumento: formatDocumento(factura.proveedor),
            moneda: factura.moneda,
            exenta: toNumber(factura.exenta),
            gravada5: toNumber(factura.gravada5),
            iva5: toNumber(factura.iva5),
            gravada10: toNumber(factura.gravada10),
            iva10: toNumber(factura.iva10),
            total: toNumber(factura.total),
        }));

        const totalesSerializados = {
            exenta: toNumber(totales._sum.exenta),
            gravada5: toNumber(totales._sum.gravada5),
            iva5: toNumber(totales._sum.iva5),
            gravada10: toNumber(totales._sum.gravada10),
            iva10: toNumber(totales._sum.iva10),
            total: toNumber(totales._sum.total),
        };

        return {
            ok: true,
            registros,
            proveedores,
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
                proveedorId: proveedorFiltro,
                fechaDesde,
                fechaHasta,
            },
            resumen: {
                cantidadComprobantes: total,
                totalCompras: totalesSerializados.total,
                totalIva5: totalesSerializados.iva5,
                totalIva10: totalesSerializados.iva10,
                totalIva:
                    totalesSerializados.iva5 + totalesSerializados.iva10,
            },
            totales: totalesSerializados,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            message: "Libro de compras obtenido correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener libro de compras:", error);

        return {
            ok: false,
            registros: [],
            proveedores: [],
            periodoFiscal: null,
            filtros: {
                month,
                proveedorId,
                fechaDesde,
                fechaHasta,
            },
            resumen: {
                cantidadComprobantes: 0,
                totalCompras: 0,
                totalIva5: 0,
                totalIva10: 0,
                totalIva: 0,
            },
            totales: {
                exenta: 0,
                gravada5: 0,
                iva5: 0,
                gravada10: 0,
                iva10: 0,
                total: 0,
            },
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo obtener el libro de compras.",
        };
    }
}