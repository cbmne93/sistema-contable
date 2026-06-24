import type { FacturaVentaFormValues } from "../validations";

export function getTodayInputValue() {
    return new Date().toISOString().slice(0, 10);
}

export function parseNumberInput(value: unknown) {
    if (value === "" || value === null || value === undefined) {
        return 0;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? 0 : numberValue;
}

export function formatNumero(numero?: number | null) {
    if (!numero) {
        return "";
    }

    return numero.toString().padStart(7, "0");
}

export function formatCurrency(value: number, moneda: string) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: moneda,
        maximumFractionDigits: moneda === "PYG" ? 0 : 2,
    }).format(value);
}

export function calcularIvaLinea(
    importe: number,
    ivaTipo: "EXENTA" | "IVA_5" | "IVA_10"
) {
    if (ivaTipo === "EXENTA") {
        return 0;
    }

    if (ivaTipo === "IVA_5") {
        return importe / 21;
    }

    return importe / 11;
}

export function calcularTotales(detalles: FacturaVentaFormValues["detalles"]) {
    return detalles.reduce(
        (acc, detalle) => {
            const cantidad = Number(detalle.cantidad || 0);
            const precioUnitario = Number(detalle.precioUnitario || 0);
            const totalLinea = cantidad * precioUnitario;

            if (detalle.ivaTipo === "EXENTA") {
                acc.exenta += totalLinea;
            }

            if (detalle.ivaTipo === "IVA_5") {
                const iva5 = totalLinea / 21;
                acc.iva5 += iva5;
                acc.gravada5 += totalLinea - iva5;
            }

            if (detalle.ivaTipo === "IVA_10") {
                const iva10 = totalLinea / 11;
                acc.iva10 += iva10;
                acc.gravada10 += totalLinea - iva10;
            }

            acc.total += totalLinea;

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