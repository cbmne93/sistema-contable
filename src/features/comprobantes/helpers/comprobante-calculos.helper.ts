export type TipoImpuestoComprobante = "EXENTA" | "IVA_5" | "IVA_10";

export interface DetalleComprobanteCalculoInput {
    cantidad: number;
    precioUnitario: number;
    ivaTipo: TipoImpuestoComprobante;
}

export interface DetalleComprobanteCalculado {
    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;
}

export function round2(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calcularDetalleComprobante(
    detalle: DetalleComprobanteCalculoInput
): DetalleComprobanteCalculado {
    const total = round2(detalle.cantidad * detalle.precioUnitario);

    if (detalle.ivaTipo === "EXENTA") {
        return {
            exenta: total,
            gravada5: 0,
            iva5: 0,
            gravada10: 0,
            iva10: 0,
            total,
        };
    }

    if (detalle.ivaTipo === "IVA_5") {
        const iva5 = round2(total / 21);
        const gravada5 = round2(total - iva5);

        return {
            exenta: 0,
            gravada5,
            iva5,
            gravada10: 0,
            iva10: 0,
            total,
        };
    }

    const iva10 = round2(total / 11);
    const gravada10 = round2(total - iva10);

    return {
        exenta: 0,
        gravada5: 0,
        iva5: 0,
        gravada10,
        iva10,
        total,
    };
}

export function calcularTotalesDetalles<
    TDetalle extends DetalleComprobanteCalculado,
>(detalles: TDetalle[]) {
    return detalles.reduce(
        (acc, detalle) => {
            acc.exenta += detalle.exenta;
            acc.gravada5 += detalle.gravada5;
            acc.iva5 += detalle.iva5;
            acc.gravada10 += detalle.gravada10;
            acc.iva10 += detalle.iva10;
            acc.total += detalle.total;

            return acc;
        },
        {
            exenta: 0,
            gravada5: 0,
            iva5: 0,
            gravada10: 0,
            iva10: 0,
            total: 0,
        }
    );
}