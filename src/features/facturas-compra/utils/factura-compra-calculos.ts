interface DetalleCalculo {
    cantidad: number;
    precioUnitario: number;
    ivaTipo: "EXENTA" | "IVA_5" | "IVA_10";
}

export interface TotalesFacturaCompra {
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

export function calcularDetalleCompra(detalle: DetalleCalculo) {
    const total = round2(
        Number(detalle.cantidad || 0) * Number(detalle.precioUnitario || 0)
    );

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

export function calcularTotalesCompra(
    detalles: DetalleCalculo[] = []
): TotalesFacturaCompra {
    const totales = detalles.reduce<TotalesFacturaCompra>(
        (acc, detalle) => {
            const calculo = calcularDetalleCompra(detalle);

            acc.exenta += calculo.exenta;
            acc.gravada5 += calculo.gravada5;
            acc.iva5 += calculo.iva5;
            acc.gravada10 += calculo.gravada10;
            acc.iva10 += calculo.iva10;
            acc.total += calculo.total;

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

    return {
        exenta: round2(totales.exenta),
        gravada5: round2(totales.gravada5),
        iva5: round2(totales.iva5),
        gravada10: round2(totales.gravada10),
        iva10: round2(totales.iva10),
        total: round2(totales.total),
    };
}

export function getTodayInputValue() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function formatCurrency(value: number, moneda: string) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: moneda,
        minimumFractionDigits: moneda === "PYG" ? 0 : 2,
        maximumFractionDigits: moneda === "PYG" ? 0 : 2,
    }).format(value);
}