"use server";

import { revalidatePath } from "next/cache";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

import {
    cleanText,
    createCsvLine,
    createTxtLine,
    formatDateMarangatu,
    formatNumeroComprobante,
    getCodigoCondicion,
    getCodigoTipoComprobante,
    getCodigoTipoDocumento,
    getFechaMesRange,
    getMesValido,
    getNextCodigo,
    getNumeroDocumentoMarangatu,
    getTiposAIncluir,
    toIntegerAmount,
    toSiNo,
    type TipoInformeMarangatuInput,
} from "../helpers";

interface GenerarMarangatuRegistroInput {
    mes: number;
    tipoInforme: TipoInformeMarangatuInput;
}

export async function generarMarangatuRegistroAction(
    input: GenerarMarangatuRegistroInput
) {
    try {
        const mes = getMesValido(Number(input.mes));

        if (!mes) {
            return {
                ok: false,
                registroId: null,
                message: "Seleccione un mes válido.",
            };
        }

        if (
            input.tipoInforme !== "TODOS" &&
            input.tipoInforme !== "COMPRAS" &&
            input.tipoInforme !== "VENTAS"
        ) {
            return {
                ok: false,
                registroId: null,
                message: "Seleccione un tipo de informe válido.",
            };
        }

        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const fechaRange = getFechaMesRange(periodoFiscal.anio, mes);

        const { incluirCompras, incluirVentas } = getTiposAIncluir(
            input.tipoInforme
        );

        const [compras, ventas, totalRegistrosPorTipo, registrosDelMesPorTipo] =
            await Promise.all([
                incluirCompras
                    ? prisma.comprobante.findMany({
                        where: {
                            empresaId,
                            tipoMovimiento: "EGRESO",
                            tipoComprobante: "FACTURA",
                            estado: "EMITIDO",
                            fechaEmision: fechaRange,
                            marangatuDetalles: {
                                none: {
                                    registro: {
                                        empresaId,
                                        estado: "GENERADO",
                                    },
                                },
                            },
                        },
                        select: {
                            id: true,
                            fechaEmision: true,
                            numeroTimbrado: true,
                            establecimiento: true,
                            puntoExpedicion: true,
                            numeroComprobante: true,
                            condicion: true,
                            moneda: true,
                            gravada10: true,
                            gravada5: true,
                            exenta: true,
                            total: true,
                            imputaIva: true,
                            imputaIre: true,
                            imputaIrpRsp: true,
                            noImputa: true,
                            proveedor: {
                                select: {
                                    nombre: true,
                                    tipoDocumento: true,
                                    numeroDocumento: true,
                                },
                            },
                        },
                        orderBy: [
                            { fechaEmision: "asc" },
                            { establecimiento: "asc" },
                            { puntoExpedicion: "asc" },
                            { numeroComprobante: "asc" },
                        ],
                        take: 5000,
                    })
                    : Promise.resolve([]),

                incluirVentas
                    ? prisma.comprobante.findMany({
                        where: {
                            empresaId,
                            tipoMovimiento: "INGRESO",
                            tipoComprobante: "FACTURA",
                            estado: "EMITIDO",
                            fechaEmision: fechaRange,
                            marangatuDetalles: {
                                none: {
                                    registro: {
                                        empresaId,
                                        estado: "GENERADO",
                                    },
                                },
                            },
                        },
                        select: {
                            id: true,
                            fechaEmision: true,
                            numeroTimbrado: true,
                            establecimiento: true,
                            puntoExpedicion: true,
                            numeroComprobante: true,
                            condicion: true,
                            moneda: true,
                            gravada10: true,
                            gravada5: true,
                            exenta: true,
                            total: true,
                            imputaIva: true,
                            imputaIre: true,
                            imputaIrpRsp: true,
                            cliente: {
                                select: {
                                    nombre: true,
                                    tipoDocumento: true,
                                    numeroDocumento: true,
                                },
                            },
                        },
                        orderBy: [
                            { fechaEmision: "asc" },
                            { establecimiento: "asc" },
                            { puntoExpedicion: "asc" },
                            { numeroComprobante: "asc" },
                        ],
                        take: 5000,
                    })
                    : Promise.resolve([]),

                prisma.marangatuRegistro.count({
                    where: {
                        empresaId,
                        tipoInforme: input.tipoInforme,
                    },
                }),

                prisma.marangatuRegistro.count({
                    where: {
                        empresaId,
                        anio: periodoFiscal.anio,
                        mes,
                        tipoInforme: input.tipoInforme,
                    },
                }),
            ]);

        const detallesCompra = compras.map((factura) => {
            const proveedor = factura.proveedor;

            const values = [
                "2",
                getCodigoTipoDocumento(proveedor?.tipoDocumento),
                getNumeroDocumentoMarangatu({
                    tipoDocumento: proveedor?.tipoDocumento,
                    numeroDocumento: proveedor?.numeroDocumento,
                }),
                cleanText(proveedor?.nombre),
                getCodigoTipoComprobante(),
                formatDateMarangatu(factura.fechaEmision),
                factura.numeroTimbrado ?? "0",
                formatNumeroComprobante(factura),
                toIntegerAmount(factura.gravada10),
                toIntegerAmount(factura.gravada5),
                toIntegerAmount(factura.exenta),
                toIntegerAmount(factura.total),
                getCodigoCondicion(factura.condicion),
                factura.moneda === "PYG" ? "N" : "S",
                toSiNo(factura.imputaIva),
                toSiNo(factura.imputaIre),
                toSiNo(factura.imputaIrpRsp),
                toSiNo(factura.noImputa),
                "",
                "",
            ];

            return {
                comprobanteId: factura.id,
                tipoRegistro: "COMPRA" as const,
                fechaEmision: factura.fechaEmision,
                tipoDocumentoCodigo: values[1],
                numeroDocumento: values[2],
                nombrePersona: values[3],
                tipoComprobanteCodigo: values[4],
                numeroTimbrado: values[6],
                numeroComprobante: values[7],
                gravada10: Number(factura.gravada10),
                gravada5: Number(factura.gravada5),
                exenta: Number(factura.exenta),
                total: Number(factura.total),
                condicionCodigo: values[12],
                monedaExtranjera: factura.moneda !== "PYG",
                imputaIva: factura.imputaIva,
                imputaIre: factura.imputaIre,
                imputaIrpRsp: factura.imputaIrpRsp,
                noImputa: factura.noImputa,
                numeroComprobanteAsociado: null,
                timbradoAsociado: null,
                lineaCsv: createCsvLine(values),
                lineaTxt: createTxtLine(values),
            };
        });

        const detallesVenta = ventas.map((factura) => {
            const cliente = factura.cliente;

            const values = [
                "1",
                getCodigoTipoDocumento(cliente?.tipoDocumento),
                getNumeroDocumentoMarangatu({
                    tipoDocumento: cliente?.tipoDocumento,
                    numeroDocumento: cliente?.numeroDocumento,
                }),
                cleanText(cliente?.nombre),
                getCodigoTipoComprobante(),
                formatDateMarangatu(factura.fechaEmision),
                factura.numeroTimbrado ?? "0",
                formatNumeroComprobante(factura),
                toIntegerAmount(factura.gravada10),
                toIntegerAmount(factura.gravada5),
                toIntegerAmount(factura.exenta),
                toIntegerAmount(factura.total),
                getCodigoCondicion(factura.condicion),
                factura.moneda === "PYG" ? "N" : "S",
                toSiNo(factura.imputaIva),
                toSiNo(factura.imputaIre),
                toSiNo(factura.imputaIrpRsp),
                "",
                "",
            ];

            return {
                comprobanteId: factura.id,
                tipoRegistro: "VENTA" as const,
                fechaEmision: factura.fechaEmision,
                tipoDocumentoCodigo: values[1],
                numeroDocumento: values[2],
                nombrePersona: values[3],
                tipoComprobanteCodigo: values[4],
                numeroTimbrado: values[6],
                numeroComprobante: values[7],
                gravada10: Number(factura.gravada10),
                gravada5: Number(factura.gravada5),
                exenta: Number(factura.exenta),
                total: Number(factura.total),
                condicionCodigo: values[12],
                monedaExtranjera: factura.moneda !== "PYG",
                imputaIva: factura.imputaIva,
                imputaIre: factura.imputaIre,
                imputaIrpRsp: factura.imputaIrpRsp,
                noImputa: false,
                numeroComprobanteAsociado: null,
                timbradoAsociado: null,
                lineaCsv: createCsvLine(values),
                lineaTxt: createTxtLine(values),
            };
        });

        const detalles = [...detallesCompra, ...detallesVenta];

        if (detalles.length === 0) {
            return {
                ok: false,
                registroId: null,
                message:
                    "No existen comprobantes pendientes para generar con los filtros seleccionados.",
            };
        }

        if (detalles.length > 5000) {
            return {
                ok: false,
                registroId: null,
                message:
                    "El registro supera el máximo de 5.000 líneas permitido para Marangatu.",
            };
        }

        const codigo = getNextCodigo(
            input.tipoInforme,
            totalRegistrosPorTipo + 1
        );

        const version = registrosDelMesPorTipo + 1;

        const registro = await prisma.marangatuRegistro.create({
            data: {
                empresaId,
                periodoFiscalId: periodoFiscal.id,
                codigo,
                version,
                anio: periodoFiscal.anio,
                mes,
                tipoInforme: input.tipoInforme,
                estado: "GENERADO",
                registrosCompra: detallesCompra.length,
                registrosVenta: detallesVenta.length,
                registrosEgreso: 0,
                registrosIngreso: 0,
                detalles: {
                    create: detalles.map((detalle, index) => ({
                        numeroLinea: index + 1,
                        ...detalle,
                    })),
                },
            },
            select: {
                id: true,
                codigo: true,
            },
        });

        revalidatePath("/reportes/marangatu");

        return {
            ok: true,
            registroId: registro.id,
            message: `Registro ${registro.codigo} generado correctamente.`,
        };
    } catch (error) {
        console.error("Error al generar registro Marangatu:", error);

        return {
            ok: false,
            registroId: null,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo generar el registro.",
        };
    }
}