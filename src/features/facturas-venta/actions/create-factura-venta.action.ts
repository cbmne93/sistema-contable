"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import {
    calcularDetalleComprobante,
    calcularTotalesDetalles,
    getFechaInputAsUTC,
    getGenerarAsientosAutomaticos,
    isFechaDentroDelPeriodo,
    limpiarCuentaContableId,
    limpiarTexto,
    round2,
    validarCuentasContablesDetalles,
    validarImputacionTributaria,
} from "@/features/comprobantes/helpers";
import { generarAsientoVentaAutomatico } from "@/features/asientos-contables/helpers";

import type { CreateFacturaVentaInput } from "../interfaces";

function formatNumeroComprobante(numero: number) {
    return numero.toString().padStart(7, "0");
}

function parseNumeroComprobante(numero?: string | null) {
    if (!numero) {
        return null;
    }

    const numeroLimpio = numero.trim();

    if (!/^\d{1,7}$/.test(numeroLimpio)) {
        return null;
    }

    return Number(numeroLimpio);
}

export async function createFacturaVentaAction(data: CreateFacturaVentaInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const periodoFiscal = await getPeriodoFiscalActivoOrThrow(empresaId);

        const fechaEmision = getFechaInputAsUTC(data.fechaEmision);

        if (!isFechaDentroDelPeriodo(fechaEmision, periodoFiscal)) {
            return {
                ok: false,
                factura: null,
                message: `La fecha de emisión debe corresponder al periodo fiscal activo ${periodoFiscal.anio}.`,
            };
        }

        if (!data.detalles.length) {
            return {
                ok: false,
                factura: null,
                message: "Debe agregar al menos un detalle a la factura.",
            };
        }

        const generarAsientosAutomaticos =
            await getGenerarAsientosAutomaticos(empresaId);

        const validacionCuentas = await validarCuentasContablesDetalles({
            empresaId,
            detalles: data.detalles,
            generarAsientosAutomaticos,
        });

        if (!validacionCuentas.ok) {
            return {
                ok: false,
                factura: null,
                message: validacionCuentas.message,
            };
        }

        if (data.moneda === "PYG" && data.cotizacion !== 1) {
            return {
                ok: false,
                factura: null,
                message: "La cotización para guaraníes debe ser 1.",
            };
        }

        if (data.cotizacion <= 0) {
            return {
                ok: false,
                factura: null,
                message: "La cotización debe ser mayor a cero.",
            };
        }

        if (!validarImputacionTributaria(data)) {
            return {
                ok: false,
                factura: null,
                message:
                    "Debe imputar el comprobante al menos a IVA, IRE o IRP-RSP.",
            };
        }

        const cliente = await prisma.cliente.findFirst({
            where: {
                id: data.clienteId,
                empresaId,
                estado: "ACTIVO",
            },
            select: {
                id: true,
            },
        });

        if (!cliente) {
            return {
                ok: false,
                factura: null,
                message: "El cliente seleccionado no es válido.",
            };
        }

        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id: data.sucursalId,
                empresaId,
                estado: "ACTIVO",
            },
            select: {
                id: true,
            },
        });

        if (!sucursal) {
            return {
                ok: false,
                factura: null,
                message: "La sucursal seleccionada no es válida.",
            };
        }

        const factura = await prisma.$transaction(async (tx) => {
            const timbrado = await tx.timbrado.findFirst({
                where: {
                    id: data.timbradoId,
                    empresaId,
                    sucursalId: data.sucursalId,
                    origen: "PROPIO",
                    tipoComprobante: "FACTURA",
                    estado: "ACTIVO",
                },
            });

            if (!timbrado) {
                throw new Error("TIMBRADO_INVALIDO");
            }

            if (
                !timbrado.numeroActual ||
                !timbrado.numeroDesde ||
                !timbrado.numeroHasta ||
                !timbrado.establecimiento ||
                !timbrado.puntoExpedicion
            ) {
                throw new Error("TIMBRADO_INCOMPLETO");
            }

            if (timbrado.numeroActual > timbrado.numeroHasta) {
                throw new Error("TIMBRADO_AGOTADO");
            }

            const numeroManual = parseNumeroComprobante(data.numeroComprobante);

            if (data.numeroComprobante && !numeroManual) {
                throw new Error("NUMERO_COMPROBANTE_INVALIDO");
            }

            const numeroAEmitir = numeroManual ?? timbrado.numeroActual;

            if (
                numeroAEmitir < timbrado.numeroDesde ||
                numeroAEmitir > timbrado.numeroHasta
            ) {
                throw new Error("NUMERO_COMPROBANTE_FUERA_DE_RANGO");
            }

            const numeroComprobante = formatNumeroComprobante(numeroAEmitir);

            const comprobanteExistente = await tx.comprobante.findFirst({
                where: {
                    empresaId,
                    tipoMovimiento: "INGRESO",
                    tipoComprobante: "FACTURA",
                    establecimiento: timbrado.establecimiento,
                    puntoExpedicion: timbrado.puntoExpedicion,
                    numeroComprobante,
                },
                select: {
                    id: true,
                },
            });

            if (comprobanteExistente) {
                throw new Error("NUMERO_COMPROBANTE_DUPLICADO");
            }

            const detallesCalculados = data.detalles.map((detalle) => {
                const calculos = calcularDetalleComprobante(detalle);

                return {
                    cuentaContableId: limpiarCuentaContableId(
                        detalle.cuentaContableId
                    ),
                    descripcion: detalle.descripcion?.trim() || "",
                    tipoImpuesto: detalle.ivaTipo,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                    ...calculos,
                };
            });

            const totales = calcularTotalesDetalles(detallesCalculados);

            const comprobante = await tx.comprobante.create({
                data: {
                    empresaId,
                    sucursalId: data.sucursalId,

                    tipoMovimiento: "INGRESO",
                    tipoComprobante: "FACTURA",
                    condicion: data.condicion,
                    estado: "EMITIDO",

                    clienteId: data.clienteId,
                    proveedorId: null,
                    timbradoId: timbrado.id,

                    numeroTimbrado: timbrado.numero,
                    establecimiento: timbrado.establecimiento,
                    puntoExpedicion: timbrado.puntoExpedicion,
                    numeroComprobante,

                    fechaEmision,
                    fechaVencimiento:
                        data.fechaVencimiento && data.fechaVencimiento !== ""
                            ? getFechaInputAsUTC(data.fechaVencimiento)
                            : null,

                    moneda: data.moneda,
                    cotizacion: data.cotizacion,

                    exenta: round2(totales.exenta),
                    gravada5: round2(totales.gravada5),
                    iva5: round2(totales.iva5),
                    gravada10: round2(totales.gravada10),
                    iva10: round2(totales.iva10),
                    total: round2(totales.total),

                    imputaIva: data.imputaIva,
                    imputaIre: data.imputaIre,
                    imputaIrpRsp: data.imputaIrpRsp,
                    noImputa: false,

                    concepto: limpiarTexto(data.concepto),

                    detalles: {
                        create: detallesCalculados.map((detalle) => ({
                            cuentaContableId: detalle.cuentaContableId,
                            descripcion: detalle.descripcion,
                            tipoImpuesto: detalle.tipoImpuesto,
                            cantidad: detalle.cantidad,
                            precioUnitario: detalle.precioUnitario,
                            exenta: round2(detalle.exenta),
                            gravada5: round2(detalle.gravada5),
                            iva5: round2(detalle.iva5),
                            gravada10: round2(detalle.gravada10),
                            iva10: round2(detalle.iva10),
                            total: round2(detalle.total),
                        })),
                    },
                },
                select: {
                    id: true,
                },
            });

            if (generarAsientosAutomaticos) {
                await generarAsientoVentaAutomatico({
                    tx,
                    empresaId,
                    periodoFiscalId: periodoFiscal.id,
                    sucursalId: data.sucursalId,
                    comprobanteId: comprobante.id,
                    fecha: fechaEmision,
                    condicion: data.condicion,
                    numeroComprobante: `${timbrado.establecimiento}-${timbrado.puntoExpedicion}-${numeroComprobante}`,
                    concepto: data.concepto,
                    total: round2(totales.total),
                    detalles: detallesCalculados,
                });
            }

            const siguienteNumero =
                numeroAEmitir >= timbrado.numeroActual
                    ? numeroAEmitir + 1
                    : timbrado.numeroActual;

            await tx.timbrado.update({
                where: {
                    id: timbrado.id,
                },
                data: {
                    numeroActual: siguienteNumero,
                },
            });

            return comprobante;
        });

        revalidatePath("/facturas-venta");
        revalidatePath("/asientos-contables");
        revalidatePath("/timbrados");

        return {
            ok: true,
            factura,
            message: generarAsientosAutomaticos
                ? "Factura de venta guardada y asiento generado correctamente."
                : "Factura de venta guardada correctamente.",
        };
    } catch (error) {
        console.error("Error al crear factura de venta:", error);

        if (error instanceof Error) {
            if (error.message === "TIMBRADO_INVALIDO") {
                return {
                    ok: false,
                    factura: null,
                    message: "El timbrado seleccionado no es válido.",
                };
            }

            if (error.message === "TIMBRADO_INCOMPLETO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "El timbrado seleccionado no tiene todos los datos necesarios.",
                };
            }

            if (error.message === "TIMBRADO_AGOTADO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "El timbrado seleccionado ya no tiene numeración disponible.",
                };
            }

            if (error.message === "NUMERO_COMPROBANTE_INVALIDO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "El número de comprobante debe tener hasta 7 dígitos numéricos.",
                };
            }

            if (error.message === "NUMERO_COMPROBANTE_FUERA_DE_RANGO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "El número de comprobante está fuera del rango del timbrado.",
                };
            }

            if (error.message === "NUMERO_COMPROBANTE_DUPLICADO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Ya existe una factura con esa numeración para este timbrado.",
                };
            }

            if (error.message === "CONFIGURACION_CONTABLE_NO_EXISTE") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar las cuentas contables antes de generar asientos automáticos.",
                };
            }

            if (error.message === "CUENTA_CLIENTES_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta Clientes para ventas a crédito.",
                };
            }

            if (error.message === "CUENTA_CAJA_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta Caja para ventas al contado.",
                };
            }

            if (error.message === "CUENTA_IVA_DEBITO_5_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta IVA débito fiscal 5%.",
                };
            }

            if (error.message === "CUENTA_IVA_DEBITO_10_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta IVA débito fiscal 10%.",
                };
            }

            if (error.message === "DETALLE_SIN_CUENTA_CONTABLE") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Todos los detalles deben tener cuenta contable para generar el asiento.",
                };
            }

            if (error.message === "ASIENTO_DESCUADRADO") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "No se pudo generar el asiento porque el debe y haber no coinciden.",
                };
            }

            if (error.message.includes("empresa activa")) {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe seleccionar una empresa activa antes de cargar facturas.",
                };
            }
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                factura: null,
                message:
                    "Ya existe una factura con esa numeración. Verifique el timbrado.",
            };
        }

        return {
            ok: false,
            factura: null,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo guardar la carga de factura.",
        };
    }
}