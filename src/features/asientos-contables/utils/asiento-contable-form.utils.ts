import type { AsientoContableFormValues } from "../validations";

export const asientoContableDefaultValues: AsientoContableFormValues = {
    fecha: new Date().toISOString().slice(0, 10),
    concepto: "",
    sucursalId: "",
    detalles: [
        {
            cuentaContableId: "",
            descripcion: "",
            debe: 0,
            haber: 0,
        },
        {
            cuentaContableId: "",
            descripcion: "",
            debe: 0,
            haber: 0,
        },
    ],
};

export function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export function calculateAsientoTotales(
    detalles: AsientoContableFormValues["detalles"]
) {
    const totalDebe = detalles.reduce(
        (total, detalle) => total + Number(detalle.debe || 0),
        0
    );

    const totalHaber = detalles.reduce(
        (total, detalle) => total + Number(detalle.haber || 0),
        0
    );

    const diferencia = totalDebe - totalHaber;

    return {
        totalDebe,
        totalHaber,
        diferencia,
        balanceado: totalDebe > 0 && totalDebe === totalHaber,
    };
}