export interface DetalleConIva {
    tipoImpuesto: string;
    iva5: number;
    iva10: number;
}

export function formatComprobanteDate(date: Date | string | null) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}

export function formatComprobanteCurrency(value: number, moneda: string) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: moneda,
        maximumFractionDigits: moneda === "PYG" ? 0 : 2,
    }).format(Number(value ?? 0));
}

export function formatNumeroComprobante({
    establecimiento,
    puntoExpedicion,
    numeroComprobante,
}: {
    establecimiento?: string | null;
    puntoExpedicion?: string | null;
    numeroComprobante: string;
}) {
    return `${establecimiento ?? "---"}-${puntoExpedicion ?? "---"
        }-${numeroComprobante}`;
}

export function formatCondicionComprobante(condicion: string) {
    if (condicion === "CONTADO") {
        return "Contado";
    }

    if (condicion === "CREDITO") {
        return "Crédito";
    }

    return condicion;
}

export function formatTipoImpuesto(tipoImpuesto: string) {
    const labels: Record<string, string> = {
        IVA_10: "IVA 10%",
        IVA_5: "IVA 5%",
        EXENTA: "Exenta",
    };

    return labels[tipoImpuesto] ?? tipoImpuesto;
}

export function getIvaDetalle(detalle: DetalleConIva) {
    if (detalle.tipoImpuesto === "IVA_5") {
        return detalle.iva5;
    }

    if (detalle.tipoImpuesto === "IVA_10") {
        return detalle.iva10;
    }

    return 0;
}

export function formatEstadoComprobante(estado: string) {
    const labels: Record<string, string> = {
        BORRADOR: "Borrador",
        EMITIDO: "Emitido",
        ANULADO: "Anulado",
    };

    return labels[estado] ?? estado;
}

export function getEstadoComprobanteBadgeClass(estado: string) {
    if (estado === "ANULADO") {
        return "border-red-200 bg-red-50 text-red-700";
    }

    if (estado === "BORRADOR") {
        return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
}