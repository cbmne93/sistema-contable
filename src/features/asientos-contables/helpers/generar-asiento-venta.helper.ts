import { Prisma } from "@/generated/prisma/client";

interface GenerarAsientoVentaDetalle {
    cuentaContableId: string | null;
    descripcion: string;
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
}

interface GenerarAsientoVentaParams {
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
    detalles: GenerarAsientoVentaDetalle[];
}

function round2(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumarHaberDetalle(detalle: GenerarAsientoVentaDetalle) {
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

export async function generarAsientoVentaAutomatico({
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
}: GenerarAsientoVentaParams) {
    const configuracion = await tx.configuracionContable.findUnique({
        where: {
            empresaId,
        },
        select: {
            cuentaClientesId: true,
            cuentaCajaId: true,
            cuentaIvaDebitoFiscal5Id: true,
            cuentaIvaDebitoFiscal10Id: true,
        },
    });

    if (!configuracion) {
        throw new Error("CONFIGURACION_CONTABLE_NO_EXISTE");
    }

    const cuentaDebeId =
        condicion === "CREDITO"
            ? configuracion.cuentaClientesId
            : configuracion.cuentaCajaId;

    if (!cuentaDebeId) {
        throw new Error(
            condicion === "CREDITO"
                ? "CUENTA_CLIENTES_NO_CONFIGURADA"
                : "CUENTA_CAJA_NO_CONFIGURADA"
        );
    }

    const totalIva5 = round2(
        detalles.reduce((acc, detalle) => acc + detalle.iva5, 0)
    );

    const totalIva10 = round2(
        detalles.reduce((acc, detalle) => acc + detalle.iva10, 0)
    );

    if (totalIva5 > 0 && !configuracion.cuentaIvaDebitoFiscal5Id) {
        throw new Error("CUENTA_IVA_DEBITO_5_NO_CONFIGURADA");
    }

    if (totalIva10 > 0 && !configuracion.cuentaIvaDebitoFiscal10Id) {
        throw new Error("CUENTA_IVA_DEBITO_10_NO_CONFIGURADA");
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

    detallesAsiento.push({
        cuentaContableId: cuentaDebeId,
        descripcion:
            condicion === "CREDITO"
                ? `Factura venta crédito ${numeroComprobante}`
                : `Factura venta contado ${numeroComprobante}`,
        debe: round2(total),
        haber: 0,
    });

    for (const detalle of detalles) {
        const haber = sumarHaberDetalle(detalle);

        if (haber <= 0 || !detalle.cuentaContableId) {
            continue;
        }

        detallesAsiento.push({
            cuentaContableId: detalle.cuentaContableId,
            descripcion: detalle.descripcion || `Venta ${numeroComprobante}`,
            debe: 0,
            haber,
        });
    }

    if (totalIva5 > 0 && configuracion.cuentaIvaDebitoFiscal5Id) {
        detallesAsiento.push({
            cuentaContableId: configuracion.cuentaIvaDebitoFiscal5Id,
            descripcion: `IVA débito fiscal 5% factura ${numeroComprobante}`,
            debe: 0,
            haber: totalIva5,
        });
    }

    if (totalIva10 > 0 && configuracion.cuentaIvaDebitoFiscal10Id) {
        detallesAsiento.push({
            cuentaContableId: configuracion.cuentaIvaDebitoFiscal10Id,
            descripcion: `IVA débito fiscal 10% factura ${numeroComprobante}`,
            debe: 0,
            haber: totalIva10,
        });
    }

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
                `Asiento automático por factura de venta ${numeroComprobante}`,

            origen: "VENTA",
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