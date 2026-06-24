"use server";

import { revalidatePath } from "next/cache";

import { generarAsientoCompraAutomatico } from "@/features/asientos-contables/helpers";
import {
    calcularDetalleComprobante,
    calcularTotalesDetalles,
    getFechaInputAsUTC,
    getGenerarAsientosAutomaticos,
    isFechaDentroDelPeriodo,
    limpiarCuentaContableId,
    limpiarTexto,
    round2,
    validarComprobanteSinAsientoRelacionado,
    validarCuentasContablesDetalles,
    validarImputacionTributaria,
    validarNumeroComprobante,
    validarTresDigitos,
} from "@/features/comprobantes/helpers";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "@/features/periodos-fiscales/helpers";
import { prisma } from "@/lib/prisma";

import type { CreateFacturaCompraInput } from "../interfaces";

export async function updateFacturaCompraAction(
    id: string,
    data: CreateFacturaCompraInput
) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const facturaActual = await prisma.comprobante.findFirst({
            where: {
                id,
                empresaId,
                tipoMovimiento: "EGRESO",
                tipoComprobante: "FACTURA",
            },
            select: {
                id: true,
            },
        });

        if (!facturaActual) {
            return {
                ok: false,
                factura: null,
                message: "No se encontró la factura de compra.",
            };
        }

        const validacionAsiento =
            await validarComprobanteSinAsientoRelacionado({
                empresaId,
                comprobanteId: id,
                accion: "editar",
            });

        if (!validacionAsiento.ok) {
            return {
                ok: false,
                factura: null,
                message: validacionAsiento.message,
            };
        }

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

        if (data.condicion === "CREDITO" && !data.fechaVencimiento) {
            return {
                ok: false,
                factura: null,
                message:
                    "Debe ingresar el vencimiento del pago para facturas a crédito.",
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

        if (!validarTresDigitos(data.establecimiento)) {
            return {
                ok: false,
                factura: null,
                message: "El establecimiento debe tener 3 dígitos.",
            };
        }

        if (!validarTresDigitos(data.puntoExpedicion)) {
            return {
                ok: false,
                factura: null,
                message: "El punto de expedición debe tener 3 dígitos.",
            };
        }

        if (!validarNumeroComprobante(data.numeroComprobante)) {
            return {
                ok: false,
                factura: null,
                message: "El número de comprobante debe tener 7 dígitos.",
            };
        }

        const proveedor = await prisma.proveedor.findFirst({
            where: {
                id: data.proveedorId,
                empresaId,
                estado: "ACTIVO",
            },
            select: {
                id: true,
            },
        });

        if (!proveedor) {
            return {
                ok: false,
                factura: null,
                message: "El proveedor seleccionado no es válido.",
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

        const timbrado = await prisma.timbrado.findFirst({
            where: {
                id: data.timbradoId,
                empresaId,
                proveedorId: data.proveedorId,
                origen: "PROVEEDOR",
                tipoComprobante: "FACTURA",
                estado: "ACTIVO",
            },
            select: {
                id: true,
                numero: true,
                fechaFin: true,
            },
        });

        if (!timbrado) {
            return {
                ok: false,
                factura: null,
                message:
                    "El timbrado seleccionado no es válido para este proveedor.",
            };
        }

        const establecimiento = data.establecimiento!.trim();
        const puntoExpedicion = data.puntoExpedicion!.trim();
        const numeroComprobante = data.numeroComprobante!.trim();

        const comprobanteExistente = await prisma.comprobante.findFirst({
            where: {
                empresaId,
                tipoMovimiento: "EGRESO",
                tipoComprobante: "FACTURA",
                proveedorId: data.proveedorId,
                establecimiento,
                puntoExpedicion,
                numeroComprobante,
                NOT: {
                    id,
                },
            },
            select: {
                id: true,
            },
        });

        if (comprobanteExistente) {
            return {
                ok: false,
                factura: null,
                message:
                    "Ya existe una factura de compra con esa numeración para este proveedor.",
            };
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

        const factura = await prisma.$transaction(async (tx) => {
            await tx.comprobanteDetalle.deleteMany({
                where: {
                    comprobanteId: id,
                },
            });

            const comprobante = await tx.comprobante.update({
                where: {
                    id,
                },
                data: {
                    sucursalId: data.sucursalId,

                    condicion: data.condicion,

                    clienteId: null,
                    proveedorId: data.proveedorId,
                    timbradoId: timbrado.id,

                    numeroTimbrado: timbrado.numero,
                    establecimiento,
                    puntoExpedicion,
                    numeroComprobante,

                    fechaEmision,
                    fechaVencimiento:
                        data.condicion === "CREDITO" &&
                            data.fechaVencimiento &&
                            data.fechaVencimiento !== ""
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
                    noImputa: data.noImputa,

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
                await generarAsientoCompraAutomatico({
                    tx,
                    empresaId,
                    periodoFiscalId: periodoFiscal.id,
                    sucursalId: data.sucursalId,
                    comprobanteId: comprobante.id,
                    fecha: fechaEmision,
                    condicion: data.condicion,
                    numeroComprobante: `${establecimiento}-${puntoExpedicion}-${numeroComprobante}`,
                    concepto: data.concepto,
                    total: round2(totales.total),
                    detalles: detallesCalculados,
                });
            }

            return comprobante;
        });

        revalidatePath("/facturas-compra");
        revalidatePath(`/facturas-compra/${factura.id}/editar`);
        revalidatePath("/asientos-contables");

        return {
            ok: true,
            factura,
            message: generarAsientosAutomaticos
                ? "Factura de compra actualizada y asiento generado correctamente."
                : "Factura de compra actualizada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar factura de compra:", error);

        if (error instanceof Error) {
            if (error.message === "CONFIGURACION_CONTABLE_NO_EXISTE") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar las cuentas contables antes de generar asientos automáticos.",
                };
            }

            if (error.message === "CUENTA_PROVEEDORES_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta Proveedores para compras a crédito.",
                };
            }

            if (error.message === "CUENTA_CAJA_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta Caja para compras al contado.",
                };
            }

            if (error.message === "CUENTA_IVA_CREDITO_5_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta IVA crédito fiscal 5%.",
                };
            }

            if (error.message === "CUENTA_IVA_CREDITO_10_NO_CONFIGURADA") {
                return {
                    ok: false,
                    factura: null,
                    message:
                        "Debe configurar la cuenta IVA crédito fiscal 10%.",
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
                        "Debe seleccionar una empresa activa antes de editar facturas de compra.",
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
                message: "Ya existe una factura de compra con esa numeración.",
            };
        }

        return {
            ok: false,
            factura: null,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar la factura de compra.",
        };
    }
}