import type { Timbrado } from "../interfaces";

export function getOrigenLabel(origen: Timbrado["origen"]) {
    const labels: Record<Timbrado["origen"], string> = {
        PROPIO: "Propio",
        PROVEEDOR: "Proveedor",
    };

    return labels[origen];
}

export function getTipoComprobanteLabel(
    tipoComprobante: Timbrado["tipoComprobante"]
) {
    const labels: Record<Timbrado["tipoComprobante"], string> = {
        FACTURA: "Factura",
        NOTA_CREDITO: "Nota crédito",
        NOTA_DEBITO: "Nota débito",
        RECIBO: "Recibo",
        AUTOFACTURA: "Autofactura",
        TICKET: "Ticket",
        OTRO: "Otro",
    };

    return labels[tipoComprobante];
}

export function formatFecha(fecha: Date | string | null) {
    if (!fecha) {
        return "-";
    }

    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(fecha));
}

export function formatNumero(numero: number | null) {
    if (!numero) {
        return "-";
    }

    return numero.toString().padStart(7, "0");
}

export function formatEstablecimientoPunto(timbrado: Timbrado) {
    if (!timbrado.establecimiento && !timbrado.puntoExpedicion) {
        return "-";
    }

    return `${timbrado.establecimiento ?? "-"} - ${timbrado.puntoExpedicion ?? "-"
        }`;
}

export function formatRango(timbrado: Timbrado) {
    if (!timbrado.numeroDesde && !timbrado.numeroHasta) {
        return "-";
    }

    return `${formatNumero(timbrado.numeroDesde)} / ${formatNumero(
        timbrado.numeroHasta
    )}`;
}