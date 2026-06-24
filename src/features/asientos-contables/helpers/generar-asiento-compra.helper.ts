import { Prisma } from "@/generated/prisma/client";

interface GenerarAsientoCompraDetalle {
    cuentaContableId: string | null;
    descripcion: string;
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
}

interface GenerarAsientoCompraParams {
    tx: Prisma.TransactionClient;
    empresaId: string;
    periodoFiscalId: string;
    sucursalId: string;
    comprobanteId: string;
    fecha: Date;
    condicion: "CONTADO" | "CREDITO";
    numeroComprobante: string;
    concepto?: string | null;
    total: number;
    detalles: GenerarAsientoCompraDetalle[];
}

function round2(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumarDebeDetalle(detalle: GenerarAsientoCompraDetalle) {
    return round2(detalle.exenta + detalle.gravada5 + detalle.gravada10);
}

async function getSiguienteNumeroAsiento({
    tx,
    empresaId,
    periodoFiscalId,
}: {
    tx: Prisma.TransactionClient;
    empresaId: string;
    periodoFiscalId: string;
}) {
    const ultimoAsiento = await tx.asientoContable.findFirst({
        where: {
            empresaId,
            periodoFiscalId,
        },
        select: {
            numero: true,
        },
        orderBy: {
            numero: "desc",
        },
    });

    return (ultimoAsiento?.numero ?? 0) + 1;
}

export async function generarAsientoCompraAutomatico({
    tx,
    empresaId,
    periodoFiscalId,
    sucursalId,
    comprobanteId,
    fecha,
    condicion,
    numeroComprobante,
    concepto,
    total,
    detalles,
}: GenerarAsientoCompraParams) {
    const configuracion = await tx.configuracionContable.findUnique({
        where: {
            empresaId,
        },
        select: {
            cuentaProveedoresId: true,
            cuentaCajaId: true,
            cuentaIvaCreditoFiscal5Id: true,
            cuentaIvaCreditoFiscal10Id: true,
        },
    });

    if (!configuracion) {
        throw new Error("CONFIGURACION_CONTABLE_NO_EXISTE");
    }

    const cuentaHaberId =
        condicion === "CREDITO"
            ? configuracion.cuentaProveedoresId
            : configuracion.cuentaCajaId;

    if (!cuentaHaberId) {
        throw new Error(
            condicion === "CREDITO"
                ? "CUENTA_PROVEEDORES_NO_CONFIGURADA"
                : "CUENTA_CAJA_NO_CONFIGURADA"
        );
    }

    const totalIva5 = round2(
        detalles.reduce((acc, detalle) => acc + detalle.iva5, 0)
    );

    const totalIva10 = round2(
        detalles.reduce((acc, detalle) => acc + detalle.iva10, 0)
    );

    if (totalIva5 > 0 && !configuracion.cuentaIvaCreditoFiscal5Id) {
        throw new Error("CUENTA_IVA_CREDITO_5_NO_CONFIGURADA");
    }

    if (totalIva10 > 0 && !configuracion.cuentaIvaCreditoFiscal10Id) {
        throw new Error("CUENTA_IVA_CREDITO_10_NO_CONFIGURADA");
    }

    const detallesSinCuenta = detalles.some(
        (detalle) => !detalle.cuentaContableId
    );

    if (detallesSinCuenta) {
        throw new Error("DETALLE_SIN_CUENTA_CONTABLE");
    }

    const numero = await getSiguienteNumeroAsiento({
        tx,
        empresaId,
        periodoFiscalId,
    });

    const detallesAsiento: {
        cuentaContableId: string;
        descripcion: string;
        debe: number;
        haber: number;
    }[] = [];

    for (const detalle of detalles) {
        const debe = sumarDebeDetalle(detalle);

        if (debe <= 0 || !detalle.cuentaContableId) {
            continue;
        }

        detallesAsiento.push({
            cuentaContableId: detalle.cuentaContableId,
            descripcion: detalle.descripcion || `Compra ${numeroComprobante}`,
            debe,
            haber: 0,
        });
    }

    if (totalIva5 > 0 && configuracion.cuentaIvaCreditoFiscal5Id) {
        detallesAsiento.push({
            cuentaContableId: configuracion.cuentaIvaCreditoFiscal5Id,
            descripcion: `IVA crédito fiscal 5% factura ${numeroComprobante}`,
            debe: totalIva5,
            haber: 0,
        });
    }

    if (totalIva10 > 0 && configuracion.cuentaIvaCreditoFiscal10Id) {
        detallesAsiento.push({
            cuentaContableId: configuracion.cuentaIvaCreditoFiscal10Id,
            descripcion: `IVA crédito fiscal 10% factura ${numeroComprobante}`,
            debe: totalIva10,
            haber: 0,
        });
    }

    detallesAsiento.push({
        cuentaContableId: cuentaHaberId,
        descripcion:
            condicion === "CREDITO"
                ? `Factura compra crédito ${numeroComprobante}`
                : `Factura compra contado ${numeroComprobante}`,
        debe: 0,
        haber: round2(total),
    });

    const totalDebe = round2(
        detallesAsiento.reduce((acc, detalle) => acc + detalle.debe, 0)
    );

    const totalHaber = round2(
        detallesAsiento.reduce((acc, detalle) => acc + detalle.haber, 0)
    );

    if (totalDebe !== totalHaber) {
        throw new Error("ASIENTO_DESCUADRADO");
    }

    await tx.asientoContable.create({
        data: {
            empresaId,
            periodoFiscalId,
            sucursalId,
            comprobanteId,

            numero,
            fecha,

            concepto:
                concepto?.trim() ||
                `Asiento automático por factura de compra ${numeroComprobante}`,

            origen: "COMPRA",
            estado: "CONFIRMADO",

            totalDebe,
            totalHaber,

            detalles: {
                create: detallesAsiento.map((detalle) => ({
                    cuentaContableId: detalle.cuentaContableId,
                    descripcion: detalle.descripcion,
                    debe: round2(detalle.debe),
                    haber: round2(detalle.haber),
                })),
            },
        },
    });
}